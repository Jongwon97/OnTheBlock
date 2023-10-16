package com.ontheblock.www.videolike.service;

import com.ontheblock.www.member.Member;
import com.ontheblock.www.member.repository.MemberRepository;
import com.ontheblock.www.notice.service.MemberNoticeService;
import com.ontheblock.www.video.domain.Video;
import com.ontheblock.www.video.repository.VideoRepository;
import com.ontheblock.www.videolike.domain.VideoLike;
import com.ontheblock.www.videolike.repository.VideoLikeRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

import org.json.simple.JSONObject;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class VideoLikeService {
    private final VideoLikeRepository videoLikeRepository;
    private final VideoRepository videoRepository;
    private final MemberRepository memberRepository;
    private final MemberNoticeService memberNoticeService;

    //좋아요
    public void like(Long videoId, Long memberId){
        Video video = videoRepository.findById(videoId).orElseThrow(()->new EntityNotFoundException());
        Member member = memberRepository.findById(memberId).orElseThrow(()->new EntityNotFoundException());
        VideoLike videoLike = VideoLike.builder().video(video).member(member).build();
        videoLikeRepository.save(videoLike);
        video.addLike();

        // ** 좋아요를 받은 사람에게 알림 추가 (본인 제외) **
        if (!member.getId().equals(video.getMember().getId())) {
            JSONObject noticeContentJson = new JSONObject();
            noticeContentJson.put("id", member.getId());
            noticeContentJson.put("nickname", member.getNickName());
            noticeContentJson.put("videoId", video.getId());

            Integer noticeType = 2;
            memberNoticeService.addMemberNotice(video.getMember().getId(), noticeType, noticeContentJson.toString());
        }
    }

    //좋아요 취소
    public void likeCancel(Long videoId, Long memberId){
        Video video = videoRepository.findById(videoId).orElseThrow(()->new EntityNotFoundException());
        Member member = memberRepository.findById(memberId).orElseThrow(()->new EntityNotFoundException());
        VideoLike videoLike = videoLikeRepository.findVideoLikeByVideoAndMember(video, member).orElseThrow(()->new EntityNotFoundException());
        videoLikeRepository.delete(videoLike);
        video.cancelLike();
    }
}
