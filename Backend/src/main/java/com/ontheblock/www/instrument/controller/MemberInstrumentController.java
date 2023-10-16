package com.ontheblock.www.instrument.controller;

import com.ontheblock.www.instrument.domain.Instrument;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ontheblock.www.instrument.service.MemberInstrumentService;

import lombok.RequiredArgsConstructor;

import java.util.List;

@RestController
@RequestMapping("/instrument")
@RequiredArgsConstructor
public class MemberInstrumentController {

	private final MemberInstrumentService memberInstrumentService;

	// 모든 악기 정보 반환
	@GetMapping("/findAll")
	public ResponseEntity<List<Instrument>> getAllInstruments() {
		return new ResponseEntity<List<Instrument>>(memberInstrumentService.getAllInstruments(), HttpStatus.OK);
	}

	// 멤버별 관심 악기 등록
	@PostMapping("/member/check")
	public ResponseEntity<Void> addMemberInstrument(HttpServletRequest request,
		@RequestBody List<Instrument> instruments) {
		Long id = (Long)request.getAttribute("id");
		memberInstrumentService.addMemberInstrument(id, instruments);
		return ResponseEntity.status(HttpStatus.CREATED).build();
	}

	// 멤버의 관심 악기 목록 조회
	@GetMapping("/get/member/check")
	public ResponseEntity<List<Instrument>> getMemberInstrument(HttpServletRequest request) {
		Long id = (Long)request.getAttribute("id");
		List<Instrument> instruments = memberInstrumentService.getMemberInstrument(id);
		if (instruments != null) {
			return ResponseEntity.ok(instruments);
		} else {
			return ResponseEntity.notFound().build();
		}
	}
}
