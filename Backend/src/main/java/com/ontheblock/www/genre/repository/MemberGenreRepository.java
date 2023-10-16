package com.ontheblock.www.genre.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ontheblock.www.genre.domain.MemberGenre;
import com.ontheblock.www.member.Member;

@Repository
public interface MemberGenreRepository extends JpaRepository<MemberGenre, Long> {

	List<MemberGenre> findByMember(Member member);

	// member로 memberGenre를 불러오면서 genre fetch 조인
	@Query("select mi from MemberGenre mi join fetch mi.genre where mi.member = :member")
	List<MemberGenre> findByMemberGenres(@Param("member") Member member);

}
