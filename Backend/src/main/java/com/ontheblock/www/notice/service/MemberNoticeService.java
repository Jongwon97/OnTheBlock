package com.ontheblock.www.notice.service;

import java.io.IOException;
import java.sql.Timestamp;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ontheblock.www.member.Member;
import com.ontheblock.www.member.repository.MemberRepository;
import com.ontheblock.www.notice.domain.MemberNotice;
import com.ontheblock.www.notice.repository.EmitterRepository;
import com.ontheblock.www.notice.repository.MemberNoticeRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MemberNoticeService {

	private final MemberRepository memberRepository;
	private final MemberNoticeRepository memberNoticeRepository;

	// 기본 타임아웃 설정
	private static final Long DEFAULT_TIMEOUT = 6000000L;

	private final EmitterRepository emitterRepository;

	/**
	 * 클라이언트가 구독을 위해 호출하는 메서드.
	 *
	 * @param userId - 구독하는 클라이언트의 사용자 아이디.
	 * @return SseEmitter - 서버에서 보낸 이벤트 Emitter
	 */
	public SseEmitter subscribe(Long userId) {
		SseEmitter emitter = createEmitter(userId);

		sendToClient(userId, "EventStream Created. [userId=" + userId + "]");
		return emitter;
	}

	/**
	 * 서버의 이벤트를 클라이언트에게 보내는 메서드
	 * 다른 서비스 로직에서 이 메서드를 사용해 데이터를 Object event에 넣고 전송하면 된다.
	 *
	 * @param userId - 메세지를 전송할 사용자의 아이디.
	 * @param event  - 전송할 이벤트 객체.
	 */
	public void notify(Long userId, Object event) {
		sendToClient(userId, event);
	}

	/**
	 * 클라이언트에게 데이터를 전송
	 *
	 * @param id   - 데이터를 받을 사용자의 아이디.
	 * @param data - 전송할 데이터.
	 */
	private void sendToClient(Long id, Object data) {
		SseEmitter emitter = emitterRepository.get(id);
		if (emitter != null) {
			try {
				ObjectMapper objectMapper = new ObjectMapper();
				String jsonData = objectMapper.writeValueAsString(data); // 데이터를 JSON 문자열로 변환

				emitter.send(SseEmitter.event().id(String.valueOf(id)).name("sse").data(jsonData)); // jsonData 변수 사용
			} catch (IOException exception) {
				emitterRepository.deleteById(id);
				emitter.completeWithError(exception);
			}
		}
	}

	/**
	 * 사용자 아이디를 기반으로 이벤트 Emitter를 생성
	 *
	 * @param id - 사용자 아이디.
	 * @return SseEmitter - 생성된 이벤트 Emitter.
	 */
	private SseEmitter createEmitter(Long id) {
		SseEmitter emitter = new SseEmitter(DEFAULT_TIMEOUT);
		emitterRepository.save(id, emitter);

		// Emitter가 완료될 때(모든 데이터가 성공적으로 전송된 상태) Emitter를 삭제한다.
		emitter.onCompletion(() -> emitterRepository.deleteById(id));
		// Emitter가 타임아웃 되었을 때(지정된 시간동안 어떠한 이벤트도 전송되지 않았을 때) Emitter를 삭제한다.
		emitter.onTimeout(() -> emitterRepository.deleteById(id));

		return emitter;
	}

	// 알림 조회
	public Map<String, Object> getMemberNotice(Long memberId) {
		List<MemberNotice> memberNotices = memberNoticeRepository.findByMember(memberId);
		// 읽지 않은 알림이 있으면 1, 없으면 0
		int hasUnread = memberNotices.stream().anyMatch(notice -> !notice.getIsRead()) ? 1 : 0;

		// 모든 알림 읽음 표시
		markIsRead(memberId);

		Map<String, Object> result = new HashMap<>();
		result.put("memberNotices", memberNotices);
		result.put("hasUnread", hasUnread);

		return result;
	}

	// 회원에 대한 모든 알림 읽음 표시
	public void markIsRead(Long memberId) {
		List<MemberNotice> unreadNotices = memberNoticeRepository.findByMemberIdAndIsReadFalse(memberId);
		for (MemberNotice notice : unreadNotices) {
			notice.updateIsRead(true);
		}
	}


	// 알림 추가
	public MemberNotice addMemberNotice(Long memberId, Integer noticeType, String noticeContent) {
		Member member = memberRepository.findById(memberId)
			.orElseThrow(() -> new IllegalArgumentException("Invalid member Id:" + memberId));

		Timestamp now = new Timestamp(System.currentTimeMillis());

		MemberNotice notice = MemberNotice.builder()
			.member(member)
			.noticeType(noticeType)
			.noticeContent(noticeContent)  // JSON 형식
			.isRead(false)
			.createdAt(now)
			.build();

		// 알림 저장
		MemberNotice savedNotice = memberNoticeRepository.save(notice);

		// ** 해당 회원에게 알람 보내기 **
		sendToClient(memberId, savedNotice);

		return savedNotice;
	}

	// 알림 삭제
	public void deleteMemberNotice(Long memberId, Long noticeId) {
		MemberNotice notice = memberNoticeRepository.findById(noticeId)
			.orElseThrow(() -> new IllegalArgumentException("Invalid notice Id:" + noticeId));

		if (!notice.getMember().getId().equals(memberId)) {
			throw new IllegalArgumentException("You do not have permission to delete this notice");
		}

		memberNoticeRepository.deleteById(noticeId);
	}
}
