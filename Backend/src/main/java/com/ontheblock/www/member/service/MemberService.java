package com.ontheblock.www.member.service;

import com.ontheblock.www.member.Member;
import com.ontheblock.www.member.dto.response.MemberProfileResponse;

public interface MemberService {
    public void saveRefreshToken(Long memberId, String refreshToken);	                    // 토큰 저장
    public String getRefreshToken(Long id);								// 토큰 반환
    public void deleteRefreshToken(Long userId);                        // 토큰 삭제

    MemberProfileResponse getMemberInfoById(Long id);

}