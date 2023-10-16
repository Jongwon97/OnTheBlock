package com.ontheblock.www.notice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ontheblock.www.notice.domain.MemberNotice;

@Repository
public interface MemberNoticeRepository extends JpaRepository<MemberNotice, Long> {

	// 알림 조회
	@Query("select mn from MemberNotice mn join fetch mn.member where mn.member.id = :memberId")
	List<MemberNotice> findByMember(@Param("memberId") Long memberId);

	// 읽지 않은 알림 조회
	List<MemberNotice> findByMemberIdAndIsReadFalse(Long memberId);

	// 알림 삭제
	void deleteById(Long noticeId);

}
