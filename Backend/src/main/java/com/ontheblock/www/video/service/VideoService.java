package com.ontheblock.www.video.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.ontheblock.www.instrument.domain.Instrument;
import com.ontheblock.www.instrument.repository.InstrumentRepository;
import com.ontheblock.www.member.Member;
import com.ontheblock.www.member.repository.MemberRepository;
import com.ontheblock.www.notice.service.MemberNoticeService;
import com.ontheblock.www.session.domain.Session;
import com.ontheblock.www.session.dto.SessionOriginRequest;
import com.ontheblock.www.session.dto.SessionRequest;
import com.ontheblock.www.session.dto.SessionResponse;
import com.ontheblock.www.session.repository.SessionRepository;
import com.ontheblock.www.session.service.SessionService;
import com.ontheblock.www.song.domain.Song;
import com.ontheblock.www.song.repository.SongRepository;
import com.ontheblock.www.video.domain.Video;
import com.ontheblock.www.video.dto.VideoRequest;
import com.ontheblock.www.video.dto.VideoDetailResponse;
import com.ontheblock.www.video.dto.VideoResponse;
import com.ontheblock.www.video.repository.VideoRepository;
import com.ontheblock.www.videolike.domain.VideoLike;
import com.ontheblock.www.videolike.repository.VideoLikeRepository;
import com.ontheblock.www.videosession.domain.VideoSession;
import com.ontheblock.www.videosession.repository.VideoSessionRepository;
import com.ontheblock.www.videowatch.domain.VideoWatch;
import com.ontheblock.www.videowatch.repository.VideoWatchRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

import org.json.simple.JSONObject;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class VideoService {

    private final MemberRepository memberRepository;
    private final VideoRepository videoRepository;
    private final VideoSessionRepository videoSessionRepository;
    private final InstrumentRepository instrumentRepository;
    private final VideoLikeRepository videoLikeRepository;
    private final VideoWatchRepository videoWatchRepository;
    private final SongRepository songRepository;
    private final SessionService sessionService;
    private final MemberNoticeService memberNoticeService;
    private final SessionRepository sessionRepository;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;
    private final AmazonS3 s3Client;

    // Session, Video, VideoSession 생성
    @Transactional
    public void saveVideo(VideoRequest videoRequest, MultipartFile sessionVideo, MultipartFile thumbnail,Long memberId){
        Member member = memberRepository.findById(memberId).
                orElseThrow(()->new EntityNotFoundException("Member Not Found")); // Member 조회

        videoRequest.getSession().setMemberId(member.getId()); // VideoRequest에 memberId 입력
        Session session = sessionService.uploadSession(videoRequest.getSession()); // DB에 Session 등록

        // song 존재 여부 확인(자작곡 여부?)
        Song song = null;
        Long songId = videoRequest.getSong().getSongId();
        if(songId != null) {
            song = songRepository.findById(songId).
                    orElseThrow(() -> new EntityNotFoundException("Song Not Found"));
        }

        // Video 생성
        Video video=new Video(videoRequest, member, song);
        VideoSession videoSession=new VideoSession(video, session, videoRequest.getSession().getVolume(),
                videoRequest.getSession().getStartPoint(), videoRequest.getSession().getSessionPosition());

        videoRepository.save(video);

        // VideoSession 추가 -> default(자기 자신)
        videoSessionRepository.save(videoSession);
        // videoSession 추가 -> 스크랩 해왔을 경우
        if(videoRequest.getOrigins() != null){
            for(SessionOriginRequest sessionOrigin:videoRequest.getOrigins()){
                Session temp=sessionService.getSession(sessionOrigin.getSessionId());
                VideoSession vs = new VideoSession(video,temp, sessionOrigin.getVolume(), sessionOrigin.getStartPoint(), sessionOrigin.getSessionPosition());
                videoSessionRepository.save(vs);

                // ** 해당 영상을 올린 회원에게 알림 추가 ** (스크랩 한 회원의 id, nickname, 새로 만들어진 영상 videoId)
                JSONObject noticeContentJson = new JSONObject();
                noticeContentJson.put("id", memberId);
                noticeContentJson.put("nickname", member.getNickName());
                noticeContentJson.put("videoId", video.getId());

                Integer noticeType = 4;
                memberNoticeService.addMemberNotice(temp.getMember().getId(), noticeType, noticeContentJson.toString());
            }

        }

        // Aws s3
        String sessionUrl=sessionService.saveSessionToS3(session, sessionVideo, member.getId());  // S3에 session 영상 등록
        sessionService.UpdateSessionUrl(session, sessionUrl); // DB에 Session Url 변경 반영

        // client가 thumbnail 등록 이미지를 보냈을 때
        if(thumbnail!=null){
            String videoThumbnailUrl=saveVideoToS3(video, thumbnail, member.getId()); // s3에 썸네일 이미지 저장
            video.changeVideoThumbnailUrl(videoThumbnailUrl);
        }
    }

    // VideoDetail 조회
    @Transactional
    public VideoDetailResponse getVideoDetail(Long videoId, Long memberId){
        Video video=videoRepository.findVideoByIdWithComments(videoId).orElseThrow(()->new EntityNotFoundException("Video Not Found"));
        //Video video = videoRepository.findById(videoId).orElseThrow(()->new EntityNotFoundException("Video Not Found"));
        List<VideoSession> videoSessionList=videoSessionRepository.findVideoSessionByVideo(video);
        VideoDetailResponse vdr=new VideoDetailResponse(video, videoLikeRepository.countByVideo(video),videoSessionList);

        if(memberId != null){
            Member member = memberRepository.findById(memberId).orElseThrow(()->new EntityNotFoundException("Member Not Found"));
            // Video 시청 존재 여부
            Optional<VideoWatch> optionalWatch = videoWatchRepository.findVideoWatchByMemberAndVideo(member,video);
            if(optionalWatch.isPresent()){
                VideoWatch watch=optionalWatch.get();
                watch.updateWatch();
            }
            else{
                VideoWatch videoWatch = VideoWatch.builder().member(member).video(video).build();
                videoWatchRepository.save(videoWatch);
                video.view();
            }
            // Video Like 클릭 여부
            Optional<VideoLike> optionalVideoLike=videoLikeRepository.findVideoLikeByVideoAndMember(video,member);
            if(optionalVideoLike.isPresent()){
                vdr.setLikeCheck(true);
            }
        }
        return vdr;
    }

    // Video 삭제
    @Transactional
    public void removeVideo(Long videoId, Long memberId){
        Video video = videoRepository.findById(videoId).orElseThrow(()->new EntityNotFoundException("Video Not Found"));
        if(video.getMember().getId().equals(memberId)){
            videoRepository.delete(video);
            deleteVideoFromS3(video.getThumbnailUrl());
            // 비디오 세션이 하나만 존재할 경우(아무도 스크랩 안했을 경우)
            if(video.getVideoSessions().size()==1){
                sessionRepository.delete(video.getVideoSessions().get(0).getSession()); // DB에서 세션 삭제
                deleteVideoFromS3(video.getVideoSessions().get(0).getSession().getSessionUrl()); // s3에서 세션 삭제
            }
        }
    }


    //영상 스크랩
    public List<SessionResponse> videoScrap(Long videoId){
        Video video = videoRepository.findById(videoId).orElseThrow(()->new EntityNotFoundException("Video Not Found"));

        List<VideoSession> videoSessions = videoSessionRepository.findVideoSessionByVideo(video);
        List<SessionResponse> result = new ArrayList<>();
        for (VideoSession videoSession : videoSessions) {
            SessionResponse sessionResponse = new SessionResponse(videoSession);
            result.add(sessionResponse);
        }
        return null;
    }

    //**=================내부 함수 영역==================//

    // Video 썸네일 S3에 저장후, 주소 반환
    public String saveVideoToS3(Video video, MultipartFile thumbnail, Long memberId){
        String s3Url=new String();
        try{
            String folderName = "videos" + "/" + memberId + "/" + video.getId(); // 원하는 폴더 이름
            String fileName = folderName + "/" + thumbnail.getOriginalFilename();
            ObjectMetadata objectMetadata = new ObjectMetadata();
            objectMetadata.setContentType(thumbnail.getContentType());
            objectMetadata.setContentLength(thumbnail.getSize());

            // 파일을 AWS S3에 업로드
            s3Client.putObject(bucket, fileName, thumbnail.getInputStream(), objectMetadata);
            s3Url="https://project-ontheblock.s3.ap-northeast-2.amazonaws.com/" + fileName;

        } catch (Exception e) {
            e.printStackTrace();
        }
        return s3Url;
    }

    // Video 썸네일 S3에서 삭제
    public void deleteVideoFromS3(String s3Url) {
        try {
            // "https://project-ontheblock.s3.ap-northeast-2.amazonaws.com/" 크기 = 59
            String objectKey = s3Url.substring(59);
            s3Client.deleteObject(bucket, objectKey);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
