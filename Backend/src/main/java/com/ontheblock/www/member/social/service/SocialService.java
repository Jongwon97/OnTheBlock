package com.ontheblock.www.member.social.service;

import com.ontheblock.www.member.JWT.JwtService;
import com.ontheblock.www.member.Member;
import com.ontheblock.www.member.repository.MemberRepository;
import com.ontheblock.www.member.social.domain.ResponseLoginMember;
import com.ontheblock.www.member.social.domain.google.GoogleUserInfo;
import com.ontheblock.www.member.social.domain.kakao.KakaoProfile;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class SocialService {

    private final MemberRepository memberRepository;

    // 카카오 로그인
    public ResponseLoginMember kakaoLoginOrRegister(KakaoProfile profile) {
        return makeResponseLoginMember(profile.getEmail(), profile.getNickname());
    }

    // 구글 로그인
    public ResponseLoginMember googleLoginOrRegister(GoogleUserInfo googleUserInfo) {
        return makeResponseLoginMember(googleUserInfo.getEmail(), googleUserInfo.getNickname());
    }

    // ResponseLoginMember 생성 후 반환
    public ResponseLoginMember makeResponseLoginMember(String email, String nickName){
        Optional<Member> optionalMember=memberRepository.findByEmail(email);
        // 새로 가입한 멤버인 경우 새로 생성하여 저장 후 반환
        if (!optionalMember.isPresent()) {
            Member member = new Member();
            member.updateEmail(email);
            member.updateNickName(nickName);
            memberRepository.save(member);
            return new ResponseLoginMember(member,0);
        }
        // 이미 가입한 멤버인 경우 유저 정보 반환
        return new ResponseLoginMember(optionalMember.get(),1);
    }
}
