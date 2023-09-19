package com.ontheblock.www.follow.dto;

import lombok.Data;

@Data
public class MemberFollowDTO {
	private Long id;
	private String nickName;

	public MemberFollowDTO(Long id, String nickName) {
		this.id = id;
		this.nickName = nickName;
	}
}
