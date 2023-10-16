package com.ontheblock.www.video.controller;


import com.ontheblock.www.comment.dto.CommentRequest;
import com.ontheblock.www.comment.service.CommentService;

import com.ontheblock.www.session.dto.SessionResponse;
import com.ontheblock.www.session.service.SessionService;
import com.ontheblock.www.video.domain.Video;
import com.ontheblock.www.video.dto.VideoDetailResponse;
import com.ontheblock.www.video.dto.VideoRequest;
import com.ontheblock.www.video.dto.VideoResponse;
import com.ontheblock.www.video.service.VideoListService;
import com.ontheblock.www.video.service.VideoService;
import com.ontheblock.www.videolike.service.VideoLikeService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URI;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/videos")
public class VideoController {

    private final SessionService sessionService;
    private final VideoService videoService;
    private final VideoListService videoListService;
    private final VideoLikeService videoLikeService;
    private final CommentService commentService;

    // Video 등록
    @PostMapping("/upload/check")
    public ResponseEntity<?> sessionUpload(@RequestPart(value = "video", required = true) VideoRequest videoRequest,
                                           @RequestPart(value = "file", required = true) MultipartFile sessionVideo,
                                           @RequestPart(value="thumbnail",required = false) MultipartFile thumbnail,
                                           HttpServletRequest request) {

        Long memberId=(Long)request.getAttribute("id");

        videoService.saveVideo(videoRequest, sessionVideo, thumbnail,memberId); // Session, Video, VideoSession 생성
        return ResponseEntity.created(URI.create("/")).build();
    }

    // 추천 Video List 조회
    @GetMapping("/recommend/check")
    public ResponseEntity<?> getRecommendVideos(HttpServletRequest request){
        Long memberId = (Long)request.getAttribute("id");
        List<VideoResponse> videos = videoListService.getRecommendVideos(memberId);
        return ResponseEntity.ok().body(videos);
    }

    // 검색 Video List 조회
    @GetMapping("/search")
    public ResponseEntity<?> videoSearch(@RequestParam(name = "keyword") String keyword) {
        List<VideoResponse> result = videoListService.searchVideos(keyword);
        return ResponseEntity.ok().body(result);
    }

    // 최근 업로드된 Video 리스트 조회
    @GetMapping("/latest")
    public ResponseEntity<?> getLatestVideos(){
        List<VideoResponse> videos = videoListService.getLatestVideos();
        return ResponseEntity.ok().body(videos);
    }

    // 본인이 업로드한 Video 리스트 조회(프로필에 등록한 비디오 조회용)
    @GetMapping("/{memberId}/upload")
    public ResponseEntity<?> getMyUploadVideos(@PathVariable Long memberId){
        List<VideoResponse> videos = videoListService.getMyVideos(memberId);
        return ResponseEntity.ok().body(videos);
    }

    // 내가 좋아요 누른 video 리스트 조회
    @GetMapping("/like/check")
    public ResponseEntity<?> getLikeVideos(HttpServletRequest request){
        Long memberId=(Long)request.getAttribute("id");
        List<VideoResponse> videos = videoListService.getLikeVideos(memberId);
        return ResponseEntity.ok().body(videos);
    }

    // 내가 시청한 Video 리스트 조회
    @GetMapping("/watch/check")
    public ResponseEntity<?> getWatchVideos(HttpServletRequest request){
        Long memberId=(Long)request.getAttribute("id");
        List<VideoResponse> videos = videoListService.getWatchVideos(memberId);
        return ResponseEntity.ok().body(videos);
    }

    // follow한 유저의 최신 업로드된 Video 리스트 조회
    @GetMapping("/follow/check")
    public ResponseEntity<?> getFollowVideos(HttpServletRequest request){
        Long memberId=(Long)request.getAttribute("id");
        List<VideoResponse> videos=videoListService.getFollowVideoList(memberId);
        return ResponseEntity.ok().body(videos);
    }

    // Video Detail 조회 -> 영상 재생
    @GetMapping("/{video_id}/detail/check")
    public ResponseEntity<?> videoView(@PathVariable("video_id") Long videoId, HttpServletRequest request) {
        Long memberId=(Long)request.getAttribute("id");
        VideoDetailResponse video = videoService.getVideoDetail(videoId, memberId);
        return ResponseEntity.ok().body(video);
    }

    // Video 삭제
    @DeleteMapping("/{video_id}/delete/check")
    public ResponseEntity<?> videoRemove(@PathVariable("video_id") Long videoId, HttpServletRequest request) {
        Long memberId=(Long)request.getAttribute("id");
        videoService.removeVideo(videoId,memberId);
        return ResponseEntity.ok().build();
    }

    // 합주할 Video 제목 검색 조회(합주한 인원이 5명 이하인 Video만 조회)
    @GetMapping("/search/compose")
    public ResponseEntity<List<VideoResponse>> videoSearchForCompose(@RequestParam(name="keyword") String keyword){
        List<VideoResponse> result=videoListService.searchVideosForCompose(keyword);
        return ResponseEntity.ok().body(result);
    }

    //영상 스크랩
    @GetMapping("/{video_id}/store")
    public ResponseEntity<?> scrapVideo(@PathVariable("video_id") Long videoId) {
        List<SessionResponse> result = videoService.videoScrap(videoId);
        return ResponseEntity.ok().body(result);
    }

    // Video 댓글 등록
    @PostMapping("/comments/check")
    public ResponseEntity<?> commentSave(@RequestBody CommentRequest commentRequest, HttpServletRequest request){
        try {
            Long memberId=(Long)request.getAttribute("id");
            commentRequest.setMemberId(memberId);
            commentService.saveComment(commentRequest);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("등록에 실패");
        }
        return ResponseEntity.created(URI.create("/")).build();
    }

    // Video 댓글 수정
    @PutMapping("/comments/check")
    public ResponseEntity<?> commentUpdate(@RequestBody CommentRequest commentRequest, HttpServletRequest request){
        Long memberId=(Long)request.getAttribute("id");
        commentRequest.setMemberId(memberId);
        commentService.modifyComment(commentRequest);
        return ResponseEntity.ok().build();
    }

    // Video 댓글 삭제
    @DeleteMapping("/comments/{comment_id}/check")
    public ResponseEntity<?> commentRemove(@PathVariable("comment_id") Long commentId, HttpServletRequest request){
        Long memberId=(Long)request.getAttribute("id");
        commentService.removeComment(commentId, memberId);
        return ResponseEntity.ok().build();
    }

    // Video 좋아요 클릭
    @PostMapping("/like/{video_id}/check")
    public ResponseEntity<?> like(@PathVariable("video_id") Long videoId, HttpServletRequest request){
        Long memberId=(Long)request.getAttribute("id");
        videoLikeService.like(videoId, memberId);
        return ResponseEntity.ok().build();
    }

    // Video 좋아요 취소
    @DeleteMapping("/like/{video_id}/check")
    public ResponseEntity<?> likeCancel(@PathVariable("video_id") Long videoId, HttpServletRequest request){
        Long memberId=(Long)request.getAttribute("id");
        videoLikeService.likeCancel(videoId, memberId);
        return ResponseEntity.ok().build();
    }
}
