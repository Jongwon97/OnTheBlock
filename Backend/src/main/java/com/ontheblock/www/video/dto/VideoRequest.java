package com.ontheblock.www.video.dto;

import com.ontheblock.www.session.dto.SessionOriginRequest;
import com.ontheblock.www.session.dto.SessionRequest;
import com.ontheblock.www.song.dto.SongRequest;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class VideoRequest {
    String name;
    String description;
    SessionRequest session;
    SongRequest song;
    List<SessionOriginRequest> origins = new ArrayList<>();
}
