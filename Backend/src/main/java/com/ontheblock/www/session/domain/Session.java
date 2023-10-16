package com.ontheblock.www.session.domain;

import com.ontheblock.www.instrument.domain.Instrument;
import com.ontheblock.www.member.Member;
import com.ontheblock.www.session.dto.SessionRequest;
import com.ontheblock.www.videosession.domain.VideoSession;
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
public class Session {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "session_id")
    private Long id;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdTime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "instrument_id")
    private Instrument instrument;

    @OneToMany(mappedBy = "session")
    private List<VideoSession> videoSessions = new ArrayList<>();

    private String sessionUrl;  // session의 s3 주소

    private Integer totalFrame; // 세션의 총 frame 수

    public void changeSessionUrl(String sessionUrl){
        this.sessionUrl=sessionUrl;
    }

    public Session(Member member, Instrument instrument, Integer totalFrame){
        this.member = member;
        this.instrument = instrument;
        this.totalFrame=totalFrame;
    }

}
