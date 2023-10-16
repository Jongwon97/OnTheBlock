package com.ontheblock.www.member.interceptor;

import com.ontheblock.www.member.JWT.JwtService;
import com.ontheblock.www.member.repository.MemberRepository;
import com.ontheblock.www.member.service.MemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// Interceptor 등록해주는 클래스
@Configuration
public class WebConfig implements WebMvcConfigurer {

	private JwtService jwtService;
	private MemberService memberService;
	private MemberRepository memberRepository;
	@Autowired
	public WebConfig(JwtService jwtService, MemberService memberService, MemberRepository memberRepository) {
		super();
		this.jwtService = jwtService;
		this.memberService = memberService;
		this.memberRepository = memberRepository;
	}

	@Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new CheckLoginInterceptor(jwtService, memberRepository))
        .addPathPatterns("/**/check") // 특정 URL 패턴에만 적용
        .order(1); // 인터셉터의 실행 순서 지정 (낮은 값이 먼저 실행);
    }
}