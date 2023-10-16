package com.ontheblock.www.comment.service;

import com.ontheblock.www.comment.domain.Comment;
import com.ontheblock.www.comment.dto.CommentRequest;
import com.ontheblock.www.comment.dto.CommentResponse;
import com.ontheblock.www.comment.repository.CommentRepository;
import com.ontheblock.www.member.Member;
import com.ontheblock.www.member.repository.MemberRepository;
import com.ontheblock.www.notice.service.MemberNoticeService;
import com.ontheblock.www.video.domain.Video;
import com.ontheblock.www.video.repository.VideoRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

import org.json.simple.JSONObject;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class CommentService {
    private final MemberRepository memberRepository;
    private final VideoRepository videoRepository;
    private final CommentRepository commentRepository;
    private final MemberNoticeService memberNoticeService;

    //댓글 등록
    @Transactional
    public void saveComment(CommentRequest commentRequest){
        Video video = videoRepository.findById(commentRequest.getVideoId()).orElseThrow(()->new EntityNotFoundException("Video Not Found"));
        Member member = memberRepository.findById(commentRequest.getMemberId()).orElseThrow(()->new EntityNotFoundException("Member Not Found"));
        Comment comment = new Comment(video, member, commentRequest.getContent());
        commentRepository.save(comment);

        // ** 댓글을 받은 사람에게 알림 추가 (본인 제외) **
        if (!member.getId().equals(video.getMember().getId())) {
            JSONObject noticeContentJson = new JSONObject();
            noticeContentJson.put("id", member.getId());
            noticeContentJson.put("nickname", member.getNickName());
            noticeContentJson.put("videoId", video.getId());

            Integer noticeType = 3;
            memberNoticeService.addMemberNotice(video.getMember().getId(), noticeType, noticeContentJson.toString());
        }
    }

    //댓글 수정
    @Transactional
    public void modifyComment(CommentRequest commentRequest){
        Member member = memberRepository.findById(commentRequest.getMemberId()).orElseThrow(()->new EntityNotFoundException("Member Not Found"));
        Optional<Comment> optionalComment = commentRepository.findById(commentRequest.getCommentId());
        if(optionalComment.isPresent()){
            Comment comment=optionalComment.get();
            // 작성자일 경우
            if(comment.getMember().getId().equals(member.getId())){
                comment.updateComment(commentRequest.getContent());
            }
        }
        else{
            throw new EntityNotFoundException();
        }
    }

    //댓글 삭제
    @Transactional
    public void removeComment(Long commentId, Long memberId){
        Member member = memberRepository.findById(memberId).orElseThrow(()->new EntityNotFoundException("Member Not Found"));
        Optional<Comment> optionalComment = commentRepository.findById(commentId);
        if(optionalComment.isPresent()){
            Comment comment=optionalComment.get();
            // 작성자일 경우
            if(comment.getMember().getId().equals(member.getId())){
                commentRepository.delete(comment);
            }
        }
        else{
            throw new EntityNotFoundException();
        }
    }

    //댓글 리스트
    public List<CommentResponse> getComments(Long videoId){
        Optional<Video> video = videoRepository.findById(videoId);
        if(video.isEmpty()) return new ArrayList<>();
        return commentRepository.findCommentsByVideo(video.get());
    }
}
