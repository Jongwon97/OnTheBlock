import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';
import styled from "styled-components";
import { getFollowing } from "../../api/follow";
import { ProfileImg } from "@/components";


function FollowingModal({ followInfoVisibility, memberId }) {
  const navigate = useNavigate();
  const [followings, setFollowings] = useState([]);

  useEffect(() => {
    getFollowing(memberId).then((response)=>{
        setFollowings(response.data.followings);
    })
  }, [memberId]);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleProfileClick = (followingId) => {
    navigate(`/profile/${followingId}`);
    handleClose();
  }

  return (
    <>
      <div onClick={handleShow} style={{ cursor: "pointer" }}>
        <b>팔로잉 {followings.length}명</b>
      </div>

      <S.Modal show={show} onHide={handleClose}>
        <S.Header closeButton>
          <S.Title>팔로잉 목록</S.Title>
        </S.Header>

        <S.Body>
          {followings.length > 0 ? (
            followings.map((following) => (
              <S.ProfileImgWrap key={following.id} onClick={() => handleProfileClick(following.id)}>
                <ProfileImg nickName={following.nickName} size="42" />
                <span style={{ marginLeft: '10px' }}>{following.nickName}</span>
              </S.ProfileImgWrap>
            ))
          ) : (
            "팔로잉이 없습니다."
          )}
        </S.Body>

      </S.Modal>

    </>
  );
}

const S = {
  Modal: styled(Modal)`
    .modal-content {
      background-color: #131313;
    }
   `,
  
   Header: styled(Modal.Header)`
    border-bottom: 2px solid #fff;
   `,
   
   Title: styled(Modal.Title)`
     color:orange; 
   `,
   
   Body: styled(Modal.Body)`
     color:#fff; 
     background-color:#131313; 
     border-top:none;
   `,
      
   ProfileImgWrap: styled.div`
      display: flex;
      align-items: center;
      position: relative;
      cursor: pointer;
      margin-top: 5px; 
   `,

};

export default FollowingModal;
