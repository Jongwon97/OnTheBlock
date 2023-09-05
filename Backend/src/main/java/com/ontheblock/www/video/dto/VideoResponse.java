package com.ontheblock.www.video.dto;

import com.ontheblock.www.video.domain.Video;

import java.time.LocalDateTime;

public class VideoResponse {
    String name;
    String description;
    Long watch;
    Long like;
    LocalDateTime createTime;

    public VideoResponse(Video video, long like){
        this.name = video.getName();
        this.description = video.getDescription();
        this.watch = video.getWatch();
        this.like = like;
        this.createTime = video.getCreatedTime();
    }
}
