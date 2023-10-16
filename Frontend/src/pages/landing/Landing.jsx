import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import kakaoBtn from "@/assets/kakao_login_button.png";
import googleBtn from "@/assets/google_login_button.png"
import Button from "react-bootstrap/Button";
import Logo from "@/assets/logo.png";
import Banner from "@/assets/banners/landing.jpeg";

function Landing() {
  const navigate = useNavigate();

  return (
    <S.Wrap>
      <S.Card>
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundImage: `linear-gradient(to bottom, rgba(117, 85, 63, 0.3), rgba(156, 96, 100, 0.5)),
            url(${Banner})`,
            backgroundSize: "cover",
            width: "100vw",
            height: "840px",
            gap: "100px",
            paddingTop: "50px",
          }}
        >
          <S.Logo src={Logo}></S.Logo>
          <div style={{ textAlign: "center", color: "white", dropShadow: "10px 10px 10px black" }}>
            나의 소소한 연주가, 색다른 합주로 태어나는 커뮤니티
            <br />
            다양한 뮤지션들을 만나보세요. 빅데이터로 관심 있는 연주를
            찾아보세요.
          </div>

          <S.LoginContainer>
            <div>
              <a
                href={
                  import.meta.env.VITE_REACT_APP_BACKEND +
                  "ontheblock/api/kakao/login"
                }
              >
                <S.LoginImage src={kakaoBtn} />
              </a>
            </div>
            <div>
              <a
                href={
                  import.meta.env.VITE_REACT_APP_BACKEND +
                  "ontheblock/api/google/login"
                }
              >
                <S.LoginImage src={googleBtn} />
              </a>
            </div>
          </S.LoginContainer>
        </div>

        {/* 
        <S.NavigateButton onClick={() => navigate("/main")}>메인 페이지로 이동하는 임시 버튼 나중에 삭제할 거에요</S.NavigateButton>

*/}
      </S.Card>
    </S.Wrap>
  );
}

const S = {
  LoginContainer: styled.div`
    > div {
      margin-top: 10px;
    }
  `,

  Wrap: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #252525;
  `,
  
  Card: styled.div`
    display: flex;
    flex-direction: column;
    justify-content:center;
    align-items:center;
   `,

   LoginImage : styled.img`
      width :200px; 
      cursor:pointer; 
      padding: 0px;
   `,

   NavigateButton : styled(Button)`
     margin-top :20px; 
     width :100%;   
   `,

   Logo: styled.img`
     width: 600px;
   `,

};

export default Landing;

