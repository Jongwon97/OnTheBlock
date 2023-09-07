package com.ontheblock.www.session.dto;

import lombok.Data;

@Data
public class SessionOriginRequest {
    Long sessionId;
    Integer volume;
    Integer startPoint;
}
