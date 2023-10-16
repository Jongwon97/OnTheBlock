package com.ontheblock.www.video.domain;

import com.ontheblock.www.comment.domain.Comment;
import com.ontheblock.www.member.Member;
import com.ontheblock.www.song.domain.Song;
import com.ontheblock.www.video.dto.VideoRequest;
import com.ontheblock.www.videolike.domain.VideoLike;
import com.ontheblock.www.videosession.domain.VideoSession;
import com.ontheblock.www.videowatch.domain.VideoWatch;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
@AllArgsConstructor(access = AccessLevel.PUBLIC)
public class Video {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "video_id")
    private Long id;

    @Column(length = 100, nullable = false)
    private String name;    // 영상 제목

    private String description; // 영상 설명

    private String thumbnailUrl; // 썸네일 이미지

    private long watchCount;     // 조회수

    private long likeCount;     // 좋아요 수

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "song_id")
    private Song song;    // 원곡

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdTime;  // 업로드 날짜

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @OneToMany(mappedBy = "video")
    private List<VideoWatch> videoWatches = new ArrayList<>();

    @OneToMany(mappedBy = "video")
    private List<Comment> comments = new ArrayList<>();

    @OneToMany(mappedBy = "video")
    private List<VideoLike> videolikes = new ArrayList<>();

    @OneToMany(mappedBy = "video")
    private List<VideoSession> videoSessions = new ArrayList<>();

    public Video(VideoRequest videoRequest,Member member, Song song){
        this.name = videoRequest.getName();
        this.description = videoRequest.getDescription();
        this.song = song;
        this.member=member;
    }

    public void view(){
        this.watchCount++;
    }

    public void addLike(){
        this.likeCount++;
    }

    public void cancelLike(){
        this.likeCount--;
    }

    public void changeVideoThumbnailUrl(String thumbnailUrl){
        this.thumbnailUrl=thumbnailUrl;
    }
}
