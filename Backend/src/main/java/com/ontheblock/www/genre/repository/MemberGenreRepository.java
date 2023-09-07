package com.ontheblock.www.genre.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ontheblock.www.genre.domain.Genre;
import com.ontheblock.www.genre.domain.MemberGenre;
import com.ontheblock.www.member.Member;

@Repository
public interface MemberGenreRepository extends JpaRepository<MemberGenre, Long> {
	MemberGenre findByMember(Member member);
	MemberGenre findByMemberAndGenre(Member member, Genre genre);

}
