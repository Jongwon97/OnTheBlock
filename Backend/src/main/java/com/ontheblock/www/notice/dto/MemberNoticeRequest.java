package com.ontheblock.www.notice.dto;

import lombok.Data;

@Data
public class MemberNoticeRequest {
	private Integer noticeType;
	private String noticeContent;

}
