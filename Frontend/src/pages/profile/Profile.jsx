import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { ProfileInfo } from "@/components";
import { ProfileContent } from "@/components";
import { getUserInfo } from "../../api/member";


function Profile() {
    const navigate = useNavigate();
    const { memberId } = useParams();
    const [userData, setUserData] = useState({id: null, nickName: '', description: ''});


    useEffect(() => {
      if (!memberId || memberId === "undefined") {
        navigate('/profile/error');
        return;
      }

      getUserInfo(memberId)
        .then((response)=>{
          setUserData(response.data);
        })
        .catch((error) => {
          // 404 에러가 뜨면 에러 페이지로 넘깁니다.
          if (error.response && error.response.status === 404) {
            navigate('/profile/error');
          }
        });
    }, [memberId]);

    return (
      <S.Wrap>

        <S.ProfileInfoContainer>
          <ProfileInfo></ProfileInfo>
        </S.ProfileInfoContainer>

        <S.ProfileContentContainer>
          <ProfileContent></ProfileContent>
        </S.ProfileContentContainer>

      </S.Wrap>
    );
  }
  
  const S = {
    Wrap: styled.div`
      background: #252525;
      padding: 0px;
      color: #d7d7d7;
    `,
    
    ProfileInfoContainer: styled.div`
      display: flex;
      height: auto;
      justify-content: center;
      align-items: center;
    `,

    ProfileContentContainer: styled.div`
      margin-top: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
    `,

  };
  
  export default Profile;
  