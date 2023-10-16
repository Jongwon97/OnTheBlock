package com.ontheblock.www.videosession.domain;

import com.ontheblock.www.session.domain.Session;
import com.ontheblock.www.video.domain.Video;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
@AllArgsConstructor(access = AccessLevel.PUBLIC)
public class VideoSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "video_session_id")
    private Long id;

    private Integer volume;

    private Integer startPoint;

    private String sessionPosition;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "video_id")
    private Video video;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id")
    private Session session;

    //새로 추가하는 세션
    public VideoSession(Video video, Session session, Integer volume, Integer startPoint, String position){
        this.video = video;
        this.session = session;
        this.volume = volume;
        this.startPoint = startPoint;
        this.sessionPosition = position;
    }
}
