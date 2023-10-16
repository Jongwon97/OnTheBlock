package com.ontheblock.www.follow.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ontheblock.www.follow.domain.MemberFollow;

@Repository
public interface MemberFollowRepository extends JpaRepository<MemberFollow, Long> {

	// 팔로워 목록 조회
	@Query("select mf from MemberFollow mf join fetch mf.following where mf.follower.id = :followerId")
	List<MemberFollow> findByFollowerId(@Param("followerId") Long followerId);

	// 팔로잉 목록 조회
	@Query("select mf from MemberFollow mf join fetch mf.follower where mf.following.id = :followingId")
	List<MemberFollow> findByFollowingId(@Param("followingId") Long followingId);

	// 팔로우 여부 체크
	boolean existsByFollowerIdAndFollowingId(Long followerId, Long followingId);

	// 팔로우 삭제
	void deleteByFollowerIdAndFollowingId(Long followerId, Long followingId);

}
