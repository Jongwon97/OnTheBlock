package com.ontheblock.www.follow.dto;

import java.util.List;
import java.util.stream.Collectors;

import com.ontheblock.www.follow.domain.MemberFollow;

import lombok.Data;

@Data
public class MemberFollowingResponse {

	private List<MemberFollowDTO> followings;

	// 팔로잉 목록
	public MemberFollowingResponse(List<MemberFollow> followings) {
		this.followings = followings.stream()
			.map(f -> new MemberFollowDTO(f.getFollowing().getId(), f.getFollowing().getNickName()))
			.collect(Collectors.toList());
	}

}
