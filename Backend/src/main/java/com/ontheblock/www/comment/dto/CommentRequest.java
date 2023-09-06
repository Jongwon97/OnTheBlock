package com.ontheblock.www.comment.dto;

import lombok.Data;

@Data
public class CommentRequest {
    Long commentId;
    Long memberId;
    Long videoId;
    String content;
}
