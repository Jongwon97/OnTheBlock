package com.ontheblock.www.follow.dto;

import lombok.Data;

@Data
public class MemberFollowDTO {
	private Long id;
	private String nickName;

	// 팔로워 팔로잉 목록 DTO
	public MemberFollowDTO(Long id, String nickName) {
		this.id = id;
		this.nickName = nickName;
	}
}
