package com.ontheblock.www.notice.domain;

import java.sql.Timestamp;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.ontheblock.www.member.Member;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity(name = "MemberNotice")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MemberNotice {

	@Id
	@Column(name = "member_notice_id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@OnDelete(action = OnDeleteAction.CASCADE)
	@JoinColumn(name = "member_id")
	@JsonBackReference
	private Member member;

	/**
	 * Notice 발생 유형
	 * 1 : 팔로우
	 * 2 : 좋아요
	 * 3 : 댓글
	 * 4 : 영상 스크랩
	 */
	@Column(name = "notice_type", nullable = false)
	private Integer noticeType;

	/**
	 * Notice 유형에 따른 내용
	 * 1 : 팔로워ID, 팔로워 닉네임
	 * 2 : 좋아요를 누른 회원 ID, 닉네임, 영상ID
	 * 3 : 댓글을 쓴 회원 ID, 닉네임, 영상ID
	 * 4 : 영상을 스크랩 한 회원 ID, 닉네임, 만들어진 영상ID
	 */
	@Column(name = "notice_content", nullable = false)
	private String noticeContent;

	@Column(name = "is_read", nullable = false)
	private boolean isRead;

	@Column(name = "created_at", nullable = false)
	private Timestamp createdAt;


	public boolean getIsRead() {
		return this.isRead;
	}

	public void updateIsRead(boolean isRead) {
		this.isRead = isRead;
	}

}
