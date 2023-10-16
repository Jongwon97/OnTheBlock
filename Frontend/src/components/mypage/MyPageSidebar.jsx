import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { CgProfile as ProfileIcon } from "react-icons/cg";
import styled from "styled-components";
import { ProfileImg } from "@/components";
import FollowerModal from "@/components/follow/FollowerModal";
import FollowingModal from "@/components/follow/FollowingModal";
import { getMyUserInfo } from "@/api/member";

function MyPageInfo() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    id: null,
    nickName: "",
    description: "",
  });

  useEffect(() => {   
    getMyUserInfo().then((response) => {
    // console.log(response.data); 
      setUserData(response.data);
    });
  }, []);

  const [followInfoVisibility, setFollowInfoVisibility] = useState(false);
  const toggleFollowInfoMenu = () => {
    setFollowInfoVisibility(!followInfoVisibility);
  };

  const location = useLocation();

  if (location.pathname === "/") {
    return null;
  }

  const pagePaths = {
    profile: "/profile",
    mypageinformation: "/mypage/information",
    mypagelike: "/mypage/like",
    mypagehistory: "/mypage/history",
    mypagework: "/mypage/work",
  };

  return (
    <>
      <S.Wrap>
        <S.SideBar className="card">
          <S.SideBarBody className="card-body">
            <S.ProfileImgWrap>
              <ProfileImg nickName={userData.nickName} size="96" />
            </S.ProfileImgWrap>
            <br />

            {/* 사용자 이름 */}
            <S.Nickname>
              <b>{userData.nickName}</b>
            </S.Nickname>
            <br />

            {/* 자기소개 문구 */}
            <S.Description>
              <p
                style={{
                  textAlign: "center",
                  fontSize: "0.9em",
                  color: "#ccc",
                }}
              >
                {userData.description}
              </p>
            </S.Description>

            <S.DescriptionWrap style={{ marginBottom: "25px" }}>
              <S.SidebarNav onClick={() => toggleFollowInfoMenu()}>
                <FollowerModal
                  followInfoVisibility={followInfoVisibility}
                  memberId={userData.id}
                />
              </S.SidebarNav>
              <S.Spacer></S.Spacer>
              <S.SidebarNav onClick={() => toggleFollowInfoMenu()}>
                <FollowingModal
                  followInfoVisibility={followInfoVisibility}
                  memberId={userData.id}
                />
              </S.SidebarNav>
            </S.DescriptionWrap>

            <S.SidebarNav
              onClick={() => navigate("/mypage/like")}
              style={
                location.pathname === pagePaths.mypagelike
                  ? { fontWeight: "bold", color: "#FAA66E" }
                  : {}
              }
            >
              <p>좋아요 표시한 영상</p>
            </S.SidebarNav>
            <S.SidebarNav
              onClick={() => navigate("/mypage/history")}
              style={
                location.pathname === pagePaths.mypagehistory
                  ? { fontWeight: "bold", color: "#FAA66E" }
                  : {}
              }
            >
              <p>시청 기록</p>
            </S.SidebarNav>
            {/*
            <S.SidebarNav
              onClick={() => navigate("/mypage/work")}
              style={
                location.pathname === pagePaths.mypagework
                  ? { fontWeight: "bold", color: "#FAA66E" }
                  : {}
              }
            >
              <p>내 작업실</p>
            </S.SidebarNav>
 */}
            <S.SidebarNav
              onClick={() => navigate("/mypage/information")}
              style={
                location.pathname === pagePaths.mypageinformation
                  ? { fontWeight: "bold", color: "#FAA66E" }
                  : {}
              }
            >
              <p>내 정보 수정</p>
            </S.SidebarNav>

            <S.SidebarNav onClick={() => navigate(`/profile/${userData.id}`)}>
              <p>내 프로필로 이동</p>
            </S.SidebarNav>
          </S.SideBarBody>
        </S.SideBar>
      </S.Wrap>
    </>
  );
}

const S = {
  Wrap: styled.div``,

  SideBar: styled.div`
    height: 100vh;
    z-index: 1;
    border: none;
    padding: 0px;
    background: black;
  `,

  SideBarBody: styled.div`
    width: 100%;
    background: rgba(13, 13, 13);
    z-index: 300;

    display: flex;
    justify-content: center;

    flex-direction: column;
    align-items: center;

    padding-top: 20px;
    padding-bottom: 20px;
  `,

  ProfileImgWrap: styled.div`
    position: relative;
    cursor: pointer;
    color: #d7d7d7;
    margin-bottom: 8px;
  `,

  Nickname: styled.div`
    color: #f4b183;
    font-size: 1.2em;
    height: 30px;
  `,

  SidebarNav: styled.div`
    text-align: center;
    margin-top: 10px;
    margin-bottom: 10px;
    white-space: pre-wrap;
    cursor: pointer;
    color: #d7d7d7;
  `,

  Description: styled.div`
    text-align: center;
    white-space: pre-wrap;
    color: #d7d7d7;
    display: flex;
    justifycontent: center;
    alignitems: center;
  `,

  DescriptionWrap: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,

  Spacer: styled.div`
    margin-left: 10px;
    margin-right: 10px;
  `,
};

export default MyPageInfo;
