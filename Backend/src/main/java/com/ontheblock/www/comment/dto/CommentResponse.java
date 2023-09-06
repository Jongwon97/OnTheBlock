package com.ontheblock.www.comment.dto;

import com.ontheblock.www.comment.domain.Comment;
import com.ontheblock.www.member.dto.MemberResponse;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CommentResponse {
    Long commentId;

    MemberResponse member;

    String content;

    LocalDateTime createdTime;

    public CommentResponse(Comment comment){
        this.commentId = comment.getId();
        this.member = new MemberResponse(comment.getMember());
    }
}
