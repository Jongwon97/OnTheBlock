package com.ontheblock.www.notice.controller;

import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.ontheblock.www.notice.domain.MemberNotice;
import com.ontheblock.www.notice.dto.MemberNoticeRequest;
import com.ontheblock.www.notice.service.MemberNoticeService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/notice")
@RequiredArgsConstructor
public class MemberNoticeController {

	private final MemberNoticeService memberNoticeService;

	@GetMapping(value = "/subscribe/check", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
	public SseEmitter subscribe(HttpServletRequest request) {
		Long id = (Long)request.getAttribute("id");
		return memberNoticeService.subscribe(id);
	}

	@PostMapping("/send-data/check")
	public void sendData(HttpServletRequest request, @RequestBody Map<String, Object> body) {
		Long id = (Long)request.getAttribute("id");
		Object data = body.get("data");
		memberNoticeService.notify(id, data);
	}

	@GetMapping("/member/check")
	public ResponseEntity<Map<String, Object>> getMemberNotice(HttpServletRequest request) {
		Long id = (Long)request.getAttribute("id");
		Map<String, Object> result = memberNoticeService.getMemberNotice(id);
		return ResponseEntity.ok(result);
	}

	@PostMapping("/member/check")
	public ResponseEntity<Void> addMemberNotice(HttpServletRequest request, @RequestBody MemberNoticeRequest noticeRequest) {
		Long id = (Long)request.getAttribute("id");
		memberNoticeService.addMemberNotice(id, noticeRequest.getNoticeType(), noticeRequest.getNoticeContent());
		return ResponseEntity.status(HttpStatus.CREATED).build();
	}

	@DeleteMapping("/member/{noticeId}/check")
	public ResponseEntity<Void> deleteMemberNotice(HttpServletRequest request, @PathVariable Long noticeId) {
		Long id = (Long)request.getAttribute("id");
		memberNoticeService.deleteMemberNotice(id, noticeId);
		return ResponseEntity.noContent().build();
	}
}
