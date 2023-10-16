package com.ontheblock.www.instrument.service;

import org.springframework.stereotype.Service;

import com.ontheblock.www.instrument.domain.Instrument;
import com.ontheblock.www.instrument.domain.MemberInstrument;
import com.ontheblock.www.instrument.repository.InstrumentRepository;
import com.ontheblock.www.instrument.repository.MemberInstrumentRepository;
import com.ontheblock.www.member.Member;
import com.ontheblock.www.member.repository.MemberRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MemberInstrumentService {

	private final MemberRepository memberRepository;
	private final InstrumentRepository instrumentRepository;
	private final MemberInstrumentRepository memberInstrumentRepository;

	// 모든 Instrument 조회해서 반환
	@Transactional
	public List<Instrument> getAllInstruments() {
		return instrumentRepository.findAll();
	}

	// 관심있는 악기 등록 - MemberInstrument
	@Transactional
	public void addMemberInstrument(Long memberId, List<Instrument> instruments) {
		Member member = memberRepository.findById(memberId)
			.orElseThrow(() -> new IllegalArgumentException("No such user exists"));

		// 해당 멤버의 MemberInstrument 다 삭제
		List<MemberInstrument> memberInstruments = memberInstrumentRepository.findByMember(member);
		if (memberInstruments != null) {
			memberInstrumentRepository.deleteAll(memberInstruments);
		}
		// 새로 등록
		List<MemberInstrument> newMemberInstruments = new ArrayList<>();
		for (Instrument instrument : instruments) {
			MemberInstrument memberInstrument = MemberInstrument.builder()
				.member(member)
				.instrument(instrument)
				.build();
			newMemberInstruments.add(memberInstrument);
		}
		memberInstrumentRepository.saveAll(newMemberInstruments);
	}

	// 멤버별 관심 악기목록 조회
	@Transactional
	public List<Instrument> getMemberInstrument(Long memberId) {
		Member member = memberRepository.findById(memberId)
			.orElseThrow(() -> new IllegalArgumentException("No such user exists"));
		List<MemberInstrument> memberInstruments = memberInstrumentRepository.findByMemberInstruments(member);
		// 불러온 memberInstruments가 비어있는 경우
		if (!memberInstruments.isEmpty()) {
			List<Instrument> instruments = new ArrayList<>();
			for (MemberInstrument m : memberInstruments) {
				instruments.add(new Instrument(m));
			}
			return instruments;
		} else {
			return null;
		}
	}
}
