package com.ontheblock.www.video.dto;

import com.ontheblock.www.session.dto.SessionOriginRequest;
import com.ontheblock.www.session.dto.SessionRequest;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class VideoRequest {
    String name;
    String description;
    Long songId;
    SessionRequest session;
    List<SessionOriginRequest> origins = new ArrayList<>();
}
