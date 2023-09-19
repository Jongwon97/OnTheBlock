package com.ontheblock.www.member.dto.response;

import com.ontheblock.www.member.Member;

import lombok.Data;

@Data
public class MemberProfileResponse {
	private Long id;
	private String nickName;
	// private String email;
	private String description;

	public MemberProfileResponse(Member member) {
		this.id = member.getId();
		this.nickName = member.getNickName();
		this.description = member.getDescription();
	}
}
