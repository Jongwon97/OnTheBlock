package com.ontheblock.www.video.service;

import com.ontheblock.www.follow.repository.MemberFollowRepository;
import com.ontheblock.www.member.Member;
import com.ontheblock.www.member.repository.MemberRepository;
import com.ontheblock.www.video.domain.Video;
import com.ontheblock.www.video.dto.VideoResponse;
import com.ontheblock.www.video.repository.VideoRepository;
import com.ontheblock.www.videolike.domain.VideoLike;
import com.ontheblock.www.videolike.repository.VideoLikeRepository;
import com.ontheblock.www.videowatch.repository.VideoWatchRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class VideoListService {
    private final MemberRepository memberRepository;
    private final VideoRepository videoRepository;

    @Value("${recommend.url}")
    String recommendUrl;
    // 최신 업로드 된 Video 5개 조회
    public List<VideoResponse> getLatestVideos(){
        List<VideoResponse> videos=videoRepository.findLatestVideos();
        return videos;
    }

    // 내가 업로드한 Video 리스트 조회
    public List<VideoResponse> getMyVideos(Long memberId) {
        Member member = memberRepository.findById(memberId).
                orElseThrow(()->new EntityNotFoundException("Member Not Found")); // Member 조회
        List<VideoResponse> videos = videoRepository.findVideosByMyUpload(member);
        return videos;
    }

    // 내가 좋아요 누른 video 리스트 조회
    public List<VideoResponse> getLikeVideos(Long memberId) {
        Member member = memberRepository.findById(memberId).
                orElseThrow(()->new EntityNotFoundException("Member Not Found")); // Member 조회
        List<VideoResponse> videos = videoRepository.findVideosByLike(member);
        return videos;
    }

    // 내가 시청한 Video 리스트 조회
    public List<VideoResponse> getWatchVideos(Long memberId) {
        Member member = memberRepository.findById(memberId).
                orElseThrow(()->new EntityNotFoundException("Member Not Found")); // Member 조회
        List<VideoResponse> videos = videoRepository.findVideosByWatch(member);
        return videos;
    }

    //follow한 유저의 최신 업로드된 Video 리스트 조회
    public List<VideoResponse> getFollowVideoList(Long memberId){
        Member member = memberRepository.findById(memberId).orElseThrow(() -> new EntityNotFoundException("Member Not Found"));
        return videoRepository.findVideosByFollower(member);
    }

    // 합주할 Video 제목 검색 조회(합주한 인원이 5명 이하인 Video만 조회)
    public List<VideoResponse> searchVideosForCompose(String keyword){
        List<Video> videos = videoRepository.findVideosBySearchForCompose("%" + keyword + "%");
        List<VideoResponse> result = new ArrayList<>();
        for (Video video : videos) {
            result.add(new VideoResponse(video));
        }
        return result;
    }

    // 검색 Video
    public List<VideoResponse> searchVideos(String keyword){

        int count = 20;

        // webClient 기본 설정
        WebClient webClient = WebClient.builder().baseUrl(recommendUrl).build();

        // api 요청
        List<Integer> block = webClient
                .get()
                .uri(uriBuilder -> uriBuilder.path("/search/" + keyword + "/" + count).build())
                .retrieve()
                .bodyToMono(List.class)
                .block();

        List<Long> response = block.stream().map(Long::valueOf).toList();
        List<VideoResponse> result = videoRepository.findVideosBySearch(response);

        return result;
    }

    // 추천 Video
    public List<VideoResponse> getRecommendVideos(Long memberId){
        Member member = memberRepository.findById(memberId).orElseThrow(() -> new EntityNotFoundException("Member Not Found"));
        // webClient 기본 설정
        WebClient webClient = WebClient.builder().baseUrl(recommendUrl).build();

        // api 요청
        List<Integer> block = webClient
                .get()
                .uri(uriBuilder -> uriBuilder.path("/videos/" + memberId).build())
                .retrieve()
                .bodyToMono(List.class)
                .block();
        List<Long> response = block.stream().map(Long::valueOf).toList();
        List<VideoResponse> result = videoRepository.findVideosByRecommend(response);
        // 결과 확인
        return result;
    }

}
