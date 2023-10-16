package com.ontheblock.www.instrument.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ontheblock.www.instrument.domain.Instrument;
import com.ontheblock.www.instrument.domain.MemberInstrument;
import com.ontheblock.www.member.Member;

import java.util.List;
import java.util.Optional;

@Repository
public interface MemberInstrumentRepository extends JpaRepository<MemberInstrument, Long> {

	List<MemberInstrument> findByMember(Member member);

	// member로 memberInstrumnet를 불러오면서 instrumnent fetch 조인
	@Query("select mi from MemberInstrument mi join fetch mi.instrument where mi.member = :member")
	List<MemberInstrument> findByMemberInstruments(@Param("member") Member member);

	Optional<MemberInstrument> findByMemberAndInstrument(Member member, Instrument instrument);

}
