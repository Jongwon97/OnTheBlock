package com.ontheblock.www.member.service;

import com.ontheblock.www.member.Member;

public interface MemberService {
    public boolean login(Member member);                                // 해당 카카오 계정으로 처음 가입하는 경우 처리
    public void saveRefreshToken(Long memberId, String refreshToken);	// 토큰 저장
    public String getRefreshToken(Long id);								// 토큰 반환
    public void deleteRefreshToken(Long userId);                        // 토큰 삭제
}