package com.ontheblock.www.member.social.domain.kakao;

import jakarta.servlet.http.HttpServletResponse;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;

import org.springframework.http.*;
import org.springframework.stereotype.Component;

import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;


@Component
@RequiredArgsConstructor
public class KakaoClient {
    @Value("${kakao.api.key}")
    private String apiKey;
    @Value("${kakao.api.host}")
    private String apiURL;
    @Value("${kakao.auth.host}")
    private String authURL;
    @Value("${kakao.url.redirect}")
    private String redirectURL;

    @Value("${front.scheme}")
    private String frontScheme;
    @Value("${front.host}")
    private String frontHost;

    // http 요청 편하게 함(Spring에서 제공)
    private RestTemplate restTemplate = new RestTemplate();

    // Redirect to get authorization code
    // 로그인 요청 주소(Get: https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI})
    public void getAuthCode(HttpServletResponse httpServletResponse) throws Exception {
        UriComponents uriComponents = UriComponentsBuilder.newInstance()
                .scheme("https")
                .host(authURL)
                .path("/oauth/authorize")
                .queryParam("client_id", apiKey)
                .queryParam("redirect_uri", redirectURL)
                .queryParam("response_type", "code")
                .build();
        httpServletResponse.sendRedirect(uriComponents.toString());
    }

    // Get Token from Kakao using authorization code
    // 토큰 요청 주소(Post: https://kauth.kakao.com/oauth/token)
    public String getToken(String authCode) throws Exception {
        // make Header
        HttpHeaders httpHeaders=new HttpHeaders();
        httpHeaders.add("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");

        // make Body
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "authorization_code");
        body.add("client_id", apiKey);
        body.add("redirect_uri", redirectURL);
        body.add("code", authCode);

        // HttpHeader와 HttpBody를 하나의 오브젝트에 담기
        HttpEntity<?> kakaoTokenRequest = new HttpEntity<>(body, httpHeaders);

        // HTTP 토큰 요청하기 - 토큰 요청 발급 주소(POST)
        UriComponents uriComponents = UriComponentsBuilder.newInstance()
                .scheme("https")
                .host(authURL)
                .path("/oauth/token")
                .build();

       KakaoToken kakaoToken = restTemplate.postForObject(uriComponents.toString(), kakaoTokenRequest, KakaoToken.class);
       return kakaoToken.getAccessToken();
    }

    // kakao accessToken을 사용하여 카카오 프로필 정보 요청
    public KakaoProfile getUserInfo(String accessToken) {
        // Make Header
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add("Authorization", "Bearer " + accessToken);
        httpHeaders.add("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");

        HttpEntity<?> request = new HttpEntity<>(httpHeaders);

        UriComponents uriComponents = UriComponentsBuilder.newInstance()
                .scheme("https")
                .host(apiURL)
                .path("/v2/user/me")
                .build();
        return restTemplate.postForObject(uriComponents.toString(), request, KakaoProfile.class);
    }

    public String getFrontURI(int isNewMember, String nickName) {
        return UriComponentsBuilder.newInstance()
                .scheme(frontScheme)
                .host(frontHost)
                .path("/bridge")
                .queryParam("isNewMember", isNewMember)
                .queryParam("nickName",nickName)
                .build()
                .toString();
    }

}
