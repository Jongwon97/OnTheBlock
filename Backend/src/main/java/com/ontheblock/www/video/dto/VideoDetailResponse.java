package com.ontheblock.www.video.dto;

import com.ontheblock.www.comment.domain.Comment;
import com.ontheblock.www.comment.dto.CommentResponse;
import com.ontheblock.www.member.dto.response.MemberResponse;
import com.ontheblock.www.session.dto.SessionResponse;
import com.ontheblock.www.song.dto.SongResponse;
import com.ontheblock.www.video.domain.Video;
import com.ontheblock.www.videosession.domain.VideoSession;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
public class VideoDetailResponse {
    Long videoId;
    String name;
    String description;
    Long watchCount;
    Long likeCount;
    boolean likeCheck;
    LocalDateTime createTime;

    List<SessionResponse> sessions=new ArrayList<>();

    List<CommentResponse> comments = new ArrayList<>();
    MemberResponse member;
    SongResponse song;

    public VideoDetailResponse(Video video, long like, List<VideoSession> videoSessions){
        this.videoId=video.getId();
        this.name = video.getName();
        this.description = video.getDescription();
        this.watchCount = video.getWatchCount();
        this.likeCount = like;
        this.createTime = video.getCreatedTime();
        this.member = new MemberResponse(video.getMember());
        for (Comment comment : video.getComments()) {
            comments.add(new CommentResponse(comment));
        }
        for(VideoSession videoSession : videoSessions){
            sessions.add(new SessionResponse(videoSession));
        }
        if(video.getSong()!=null){
            this.song=new SongResponse(video.getSong());
        }

    }
}
