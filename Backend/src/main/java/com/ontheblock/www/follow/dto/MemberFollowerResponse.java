package com.ontheblock.www.follow.dto;

import java.util.List;
import java.util.stream.Collectors;
import com.ontheblock.www.follow.domain.MemberFollow;

import lombok.Data;

@Data
public class MemberFollowerResponse {

	private List<MemberFollowDTO> followers;

	// 팔로워 목록
	public MemberFollowerResponse(List<MemberFollow> followers) {
		this.followers = followers.stream()
			.map(f -> new MemberFollowDTO(f.getFollower().getId(), f.getFollower().getNickName()))
			.collect(Collectors.toList());
	}
}