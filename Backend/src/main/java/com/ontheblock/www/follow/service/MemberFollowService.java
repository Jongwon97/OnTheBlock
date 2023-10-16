package com.ontheblock.www.follow.service;

import java.util.List;

import org.json.simple.JSONObject;
import org.springframework.stereotype.Service;

import com.ontheblock.www.follow.domain.MemberFollow;
import com.ontheblock.www.follow.dto.MemberFollowerResponse;
import com.ontheblock.www.follow.dto.MemberFollowingResponse;
import com.ontheblock.www.follow.repository.MemberFollowRepository;
import com.ontheblock.www.member.Member;
import com.ontheblock.www.member.repository.MemberRepository;
import com.ontheblock.www.notice.service.MemberNoticeService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MemberFollowService {

	private final MemberRepository memberRepository;
	private final MemberFollowRepository memberFollowRepository;
	private final MemberNoticeService memberNoticeService;

	// 팔로워 목록 조회
	@Transactional
	public MemberFollowerResponse getMemberFollower(Long id) {
		List<MemberFollow> followers = this.memberFollowRepository.findByFollowingId(id);
		if (followers != null) {
			return new MemberFollowerResponse(followers);
		}
		return null;
	}

	// 팔로잉 목록 조회
	@Transactional
	public MemberFollowingResponse getMemberFollowing(Long id) {
		List<MemberFollow> followings = this.memberFollowRepository.findByFollowerId(id);
		if (followings != null) {
			return new MemberFollowingResponse(followings);
		}
		return null;
	}

	// 팔로우 여부 체크
	@Transactional
	public boolean checkMemberFollow(Long followerId, Long followingId) {
		return memberFollowRepository.existsByFollowerIdAndFollowingId(followerId, followingId);
	}

	// 팔로우 추가
	@Transactional
	public void addMemberFollow(Long followerId, Long followingId) {
		if (followerId.equals(followingId)) {
			throw new IllegalArgumentException("Follower and Following cannot be the same");
		}

		if (memberFollowRepository.existsByFollowerIdAndFollowingId(followerId, followingId)) {
			throw new IllegalArgumentException("Already followed");
		}

		Member follower = memberRepository.findById(followerId)
			.orElseThrow(() -> new IllegalArgumentException("No such follower"));

		Member following = memberRepository.findById(followingId)
			.orElseThrow(() -> new IllegalArgumentException("No such following"));

		MemberFollow memberFollow = MemberFollow.builder()
			.follower(follower)
			.following(following)
			.build();

		memberFollowRepository.save(memberFollow);

		// ** 팔로우를 받은 사람에게 알림 추가 **
		JSONObject noticeContentJson = new JSONObject();
		noticeContentJson.put("id", follower.getId());
		noticeContentJson.put("nickname", follower.getNickName());

		Integer noticeType = 1;
		memberNoticeService.addMemberNotice(following.getId(), noticeType, noticeContentJson.toString());

	}

	// 팔로우 삭제
	@Transactional
	public void deleteMemberFollow(Long followerId, Long followingId) {
		if (followerId.equals(followingId)) {
			throw new IllegalArgumentException("Follower and Following cannot be the same");
		}

		if (!memberFollowRepository.existsByFollowerIdAndFollowingId(followerId, followingId)) {
			throw new IllegalArgumentException("No such follow relationship");
		}
		memberFollowRepository.deleteByFollowerIdAndFollowingId(followerId, followingId);
	}
}
