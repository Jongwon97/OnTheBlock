package com.ontheblock.www.member.dto.response;

import com.ontheblock.www.member.Member;

import lombok.Data;

@Data
public class MemberProfileResponse {
	private Long id;
	private String nickName;
	private String description;

	// 프로필 정보
	public MemberProfileResponse(Member member) {
		this.id = member.getId();
		this.nickName = member.getNickName();
		this.description = member.getDescription();
	}
}
