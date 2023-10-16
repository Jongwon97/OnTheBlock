package com.ontheblock.www.video.dto;

import com.ontheblock.www.member.dto.response.MemberResponse;
import com.ontheblock.www.song.domain.Song;
import com.ontheblock.www.song.dto.SongResponse;
import com.ontheblock.www.video.domain.Video;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class VideoResponse {
    Long videoId;
    String name;
    Long watchCount;
    Long likeCount;
    LocalDateTime createTime;
    MemberResponse member;
    String thumbnail;
    SongResponse song;

    public VideoResponse(Video video){
        this.videoId=video.getId();
        this.name = video.getName();
        this.watchCount = video.getWatchCount();
        this.likeCount=video.getLikeCount();
        this.createTime = video.getCreatedTime();
        this.thumbnail=video.getThumbnailUrl().replaceAll("[+]", "%2B");
        this.member = new MemberResponse(video.getMember());
        if(video.getSong()!=null){
            this.song=new SongResponse(video.getSong());
        }
    }
}
