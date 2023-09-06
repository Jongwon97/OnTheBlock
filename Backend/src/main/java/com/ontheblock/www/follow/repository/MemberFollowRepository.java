package com.ontheblock.www.follow.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ontheblock.www.follow.domain.MemberFollow;
import com.ontheblock.www.member.Member;

@Repository
public interface MemberFollowRepository extends JpaRepository<MemberFollow, Long> {
	MemberFollow findByFollower(Member follower);

}
