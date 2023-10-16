import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Bridge() {
  const navigate = useNavigate();
  const location = useLocation(); // useLocation 훅을 사용하여 현재 경로 정보를 가져옴
  const queryParams = new URLSearchParams(location.search); // 쿼리 문자열을 파싱하기 위해 사용


  useEffect(() => {
      // 쿠키를 불러옴
      const cookieString = document.cookie;
      // 쿠키에서 데이터를 분리한 후 데이터 저장
      const accessToken = cookieString.split(';').find((cookie) => cookie.trim().startsWith('accessToken=')).split('=')[1].trim();
      const refreshToken = cookieString.split(';').find((cookie) => cookie.trim().startsWith('refreshToken=')).split('=')[1].trim();
      const memberId=  cookieString.split(';').find((cookie) => cookie.trim().startsWith('memberId=')).split('=')[1].trim();
    
      // 토큰을 로컬에 저장
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('memberId', memberId);
    
      // 쿼리 문자열에서 isNewMember 값을 추출
      const isNewMember = queryParams.get('isNewMember');
      const queryName=queryParams.get("nickName");
      
      localStorage.setItem("nickName",queryName); // 닉네임 저장

      // 1인 경우 기존 멤버
      if (isNewMember === '1') {
        // main 페이지로 이동
        navigate('/main', { replace: true });
        //navigate('/memberInit', { replace: true });
      }
      // 0인 경우 new 멤버
      else {
        // 멤버 초기 입력 페이지로 이동
        navigate('/memberInit', { replace: true });
      }
  }, []);

  return (
    <div className="Bridge">
    </div>
  );
}

export default Bridge;