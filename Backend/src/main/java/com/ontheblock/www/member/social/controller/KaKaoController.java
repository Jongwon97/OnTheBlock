package com.ontheblock.www.member.social.controller;


import com.ontheblock.www.member.JWT.JwtService;
import com.ontheblock.www.member.service.MemberService;
import com.ontheblock.www.member.social.domain.kakao.KakaoClient;
import com.ontheblock.www.member.social.domain.kakao.KakaoProfile;
import com.ontheblock.www.member.social.domain.ResponseLoginMember;
import com.ontheblock.www.member.social.service.SocialService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RequestMapping("/kakao")
@RestController
@RequiredArgsConstructor
public class KaKaoController {
    private final KakaoClient kakaoClient;
    private final SocialService socialService;
    private final JwtService jwtService;
    private final MemberService memberService;

    @GetMapping("/login")
    public void getKakaoAuthUrl(HttpServletResponse httpServletResponse) throws Exception{
        kakaoClient.getAuthCode(httpServletResponse);
    }

    @GetMapping("/redirect")
    public ResponseEntity<?> kakaoRedirect(@RequestParam("code") String authCode,HttpServletResponse response) throws Exception{
        String kakaoToken=kakaoClient.getToken(authCode); // authCode로 token 요청
        KakaoProfile kakaoProfile=kakaoClient.getUserInfo(kakaoToken); // token으로 kakao member data 요청
        ResponseLoginMember member=socialService.kakaoLoginOrRegister(kakaoProfile);        // kakaoProfile 정보로 member 조회 or 저장

        Map<String, Object> tokenMap = new HashMap<>();
        tokenMap.put("id", member.getMemberId());
        tokenMap.put("nickname", member.getNickname());
        String accessToken = jwtService.createAccessToken(tokenMap); // AccessToken 생성
        String refreshToken = jwtService.createRefreshToken(tokenMap);  // RefreshToken 생성

        memberService.saveRefreshToken(member.getMemberId(), refreshToken); // 토큰 저장

        // 이동할 프론트 페이지 주소 설정
        String frontURI = kakaoClient.getFrontURI(member.getIsNewMember(), member.getNickname());

        // 쿠키로 보내면 자동으로 local에 저장됨.
        Cookie cookie = new Cookie("accessToken", accessToken);
        cookie.setHttpOnly(false);
        cookie.setMaxAge(3600); // 쿠키 유효 시간 설정 (예: 1시간)
        cookie.setPath("/");
        response.addCookie(cookie);

        Cookie cookie2 = new Cookie("refreshToken",refreshToken);
        cookie2.setHttpOnly(false);
        cookie2.setMaxAge(3600);
        cookie2.setPath("/");
        response.addCookie(cookie2);

        Cookie cookie3 = new Cookie("memberId",member.getMemberId().toString());
        cookie3.setHttpOnly(false);
        cookie3.setMaxAge(3600);
        cookie3.setPath("/");
        response.addCookie(cookie3);

        return ResponseEntity
                .status(HttpStatus.FOUND) // 302
                .location(URI.create(frontURI))
                .build();
    }

}
