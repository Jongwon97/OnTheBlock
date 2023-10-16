import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CgProfile as ProfileIcon } from "react-icons/cg";
import styled from "styled-components";
import Button from 'react-bootstrap/Button';
import FollowerModal from "@/components/follow/FollowerModal";
import FollowingModal from "@/components/follow/FollowingModal";
import { getUserInfo } from "@/api/member";
import { checkFollow, addFollow, deleteFollow,  } from "@/api/follow";
import { ProfileImg } from "@/components";

function ProfileInfo() {
  const navigate = useNavigate();
  const { memberId } = useParams();

  const [userData, setUserData] = useState({id: null, nickName: '', description: ''});
  const [checkFollowData, setCheckFollowData] = useState(2);

  useEffect(() => {
    getUserInfo(memberId).then((response)=>{
      setUserData(response.data);
    })
    checkFollow(memberId).then((response)=>{
      setCheckFollowData(response.data);
    })
  }, [memberId]);

  const sendAddFollow = async (userId) => {
    try {
      const response = await addFollow(userId);
      setUserData(prevData => ({...prevData, followers: response.data.followers}));
      const isFollowing = await checkFollow(userId);
      setCheckFollowData(isFollowing.data);
    } catch (error) {
      console.error(error);
    }
  };
  
  const sendDeleteFollow = async (userId) => {
    try {
      const response = await deleteFollow(userId);
      setUserData(prevData => ({...prevData, followers: response.data.followers}));
      const isFollowing = await checkFollow(userId);
      setCheckFollowData(isFollowing.data);  
    } catch (error) {
      console.error(error);
    }
  };

  const [followInfoVisibility, setFollowInfoVisibility] = useState(false);
  const toggleFollowInfoMenu = () => {
    setFollowInfoVisibility(!followInfoVisibility);
  };

  return (
    <>
      <S.Wrap>
        <S.Card>
          <S.CardBody>
            <div style={{ display: "flex" }}>
              <S.LeftSection>
                <ProfileImg nickName={userData.nickName} size="128" />
              </S.LeftSection>
              <S.Spacer></S.Spacer>
              <S.Spacer></S.Spacer>
              <S.RightSection>
                {/* 사용자 이름 */}
                <S.Description>
                  <div style={{ color: "orange", fontSize: "1.2em" }}>
                    <b>{userData.nickName || ""}</b>
                  </div>
                </S.Description>
                <br />

                {/* 자기소개 문구 */}
                <S.Description>
                  <p>{userData.description || ""}</p>
                </S.Description>

                <S.DescriptionWrap>
                  <S.Description onClick={() => toggleFollowInfoMenu()}>
                    <FollowerModal
                      followInfoVisibility={followInfoVisibility}
                      memberId={memberId}
                    />
                  </S.Description>
                  <S.Spacer></S.Spacer>
                  <S.Description onClick={() => toggleFollowInfoMenu()}>
                    <FollowingModal
                      followInfoVisibility={followInfoVisibility}
                      memberId={memberId}
                    />
                  </S.Description>
                </S.DescriptionWrap>
                <br />

                {checkFollowData === 1 ? (
                  <Button
                    variant="outline-danger"
                    onClick={() => sendDeleteFollow(memberId)}
                  >
                    언팔로우
                  </Button>
                ) : checkFollowData === 0 ? (
                  <Button
                    variant="outline-primary"
                    onClick={() => sendAddFollow(memberId)}
                  >
                    팔로우
                  </Button>
                ) : (
                  <></>
                )}
              </S.RightSection>
            </div>
          </S.CardBody>
        </S.Card>
      </S.Wrap>
    </>
  );
}

const S = {
  Wrap: styled.div``,

  Card: styled.div`
    width: 80vw;
    z-index: 1;
    border: none;
    padding: 0px;
  `,

  CardTopText: styled.div``,

  CardBody: styled.div`
    background: rgba(13, 13, 13);
    height: 240px;
    color: white;
    margin-top: 20px;
    border-radius: 20px;

    display: flex;
    padding-left: 80px;
    justify-content: start;

    flex-direction: row;
    align-items: center;
  `,

  LeftSection: styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  `,

  RightSection: styled.div`
    display: flex;
    justify-content: center;
    align-items: start;
    flex-direction: column;
    margin-right: 80px;
  `,

  DarkOverlay: styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
  `,

  ProfileIconWrap: styled.div`
    display: flex;
    align-items: center;
    justify-conent: center;
  `,

  Description: styled.div`
    text-align: start;
    color: #d7d7d7;
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

export default ProfileInfo;
