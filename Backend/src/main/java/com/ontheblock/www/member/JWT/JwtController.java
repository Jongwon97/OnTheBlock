package com.ontheblock.www.member.JWT;

import com.ontheblock.www.member.Member;
import com.ontheblock.www.member.service.MemberService;
import jakarta.servlet.http.HttpServletRequest;

import java.util.HashMap;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RequestMapping("/jwt")
@RestController
@RequiredArgsConstructor
public class JwtController {

  private final JwtService jwtService;
  private final MemberService memberService;

  @GetMapping("/reissue")
  public ResponseEntity<?> reissueTokens(
      HttpServletRequest httpServletRequest) {

    String refreshToken = httpServletRequest.getHeader("refreshToken");
    Long memberId = jwtService.getIdFromToken(refreshToken); // token에서 id를 꺼냄
    Member member=memberService.getMember(memberId);         // member 조회

    if(member!=null){
      if (jwtService.isRefreshTokenValid(refreshToken, member.getId())) {
        Map<String, Object> tokenMap = new HashMap<>();
        tokenMap.put("id", member.getId());
        tokenMap.put("nickname", member.getNickName());
        String newAccessToken = jwtService.createAccessToken(tokenMap); // AccessToken 생성
        String newRefreshToken = jwtService.createRefreshToken(tokenMap);  // RefreshToken 생성

        memberService.saveRefreshToken(memberId, newRefreshToken);

        Map<String, String> body = new HashMap<>();
        body.put("accessToken", newAccessToken);
        body.put("refreshToken", newRefreshToken);
        return new ResponseEntity<>(body, HttpStatus.OK);
      }
    }
    return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
  }
}
