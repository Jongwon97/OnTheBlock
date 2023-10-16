package com.ontheblock.www.follow.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ontheblock.www.follow.dto.MemberFollowerResponse;
import com.ontheblock.www.follow.dto.MemberFollowingResponse;
import com.ontheblock.www.follow.service.MemberFollowService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/follow")
@RequiredArgsConstructor
public class MemberFollowController {

	private final MemberFollowService memberFollowService;

	// 팔로워 목록 불러오기
	@GetMapping("/member/follower/check")
	public ResponseEntity<MemberFollowerResponse> getMemberFollower(HttpServletRequest request, Long memberId) {
		// Long id = (Long)request.getAttribute("id");
		MemberFollowerResponse memberFollower = memberFollowService.getMemberFollower(memberId);
		if (memberFollower != null) {
			return ResponseEntity.ok(memberFollower);
		} else {
			return ResponseEntity.notFound().build();
		}
	}

	// 팔로잉 목록 불러오기
	@GetMapping("/member/following/check")
	public ResponseEntity<MemberFollowingResponse> getMemberFollowing(HttpServletRequest request, Long memberId) {
		// Long id = (Long)request.getAttribute("id");
		MemberFollowingResponse memberFollowing = memberFollowService.getMemberFollowing(memberId);
		if (memberFollowing != null) {
			return ResponseEntity.ok(memberFollowing);
		} else {
			return ResponseEntity.notFound().build();
		}
	}

	// 요청 유저의 상대 유저 팔로우 여부 화인
	@GetMapping("/member/{followerId}/check")
	public ResponseEntity<Integer> checkMemberFollow(HttpServletRequest request,
		@PathVariable("followerId") Long followerId) {
		Long id = (Long)request.getAttribute("id");

		// 요청과 상대 Id가 서로 같은 경우 (본인인 경우) 2를 반환
		if (id.equals(followerId)) {
			return ResponseEntity.ok(2);
		}
		boolean isFollowing = memberFollowService.checkMemberFollow(id, followerId);
		// 팔로우를 한 상태면 1, 하지 않은 상태면 0 반환
		return ResponseEntity.ok(isFollowing ? 1 : 0);
	}

	// 요청 유저가 상대 유저 팔로우 추가
	@PostMapping("/member/{followerId}/check")
	public ResponseEntity<String> addMemberFollow(HttpServletRequest request,
		@PathVariable("followerId") Long followerId) {
		Long id = (Long)request.getAttribute("id");
		memberFollowService.addMemberFollow(id, followerId);
		return ResponseEntity.status(HttpStatus.CREATED).build();
	}

	// 요청 유저가 상대 유저 팔로우 삭제
	@DeleteMapping("/member/{followerId}/check")
	public ResponseEntity<String> deleteMemberFollow(HttpServletRequest request,
		@PathVariable("followerId") Long followerId) {
		Long id = (Long)request.getAttribute("id");
		memberFollowService.deleteMemberFollow(id, followerId);
		return ResponseEntity.noContent().build();
	}

}
