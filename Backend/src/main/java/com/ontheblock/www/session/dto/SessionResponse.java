package com.ontheblock.www.session.dto;

import com.ontheblock.www.member.Member;
import com.ontheblock.www.member.dto.response.MemberResponse;
import com.ontheblock.www.videosession.domain.VideoSession;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class SessionResponse {
    Long sessionId;

    MemberResponse member;

    String instrument;

    LocalDateTime createdTime;

    Integer volume;

    Integer startPoint;

    String sessionUrl;

    Integer totalFrame;

    String sessionPosition;

    public SessionResponse(VideoSession videoSession){
        this.sessionId=videoSession.getSession().getId();
        this.member = new MemberResponse(videoSession.getSession().getMember());
        this.instrument = videoSession.getSession().getInstrument().getInstrumentName();
        this.createdTime = videoSession.getSession().getCreatedTime();
        this.volume = videoSession.getVolume();
        this.startPoint = videoSession.getStartPoint();
        this.sessionUrl=videoSession.getSession().getSessionUrl().replaceAll("[+]", "%2B");
        this.totalFrame=videoSession.getSession().getTotalFrame();
        this.sessionPosition= videoSession.getSessionPosition();
    }

}
