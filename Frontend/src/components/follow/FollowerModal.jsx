import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';
import styled from "styled-components";
import { getFollower } from "../../api/follow";
import { ProfileImg } from "@/components";


function FollowerModal({ followInfoVisibility, memberId }) {
  const navigate = useNavigate();
  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    getFollower(memberId).then((response)=>{
        setFollowers(response.data.followers);
    })
  }, [memberId]);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleProfileClick = (followerId) => {
    navigate(`/profile/${followerId}`);
    handleClose();
  }

  return (
    <>
      <div onClick={handleShow} style={{ cursor: "pointer" }}>
        <b>팔로워 {followers.length}명</b>
      </div>

      <S.Modal show={show} onHide={handleClose}>
        <S.Header closeButton>
          <S.Title>팔로워 목록</S.Title>
        </S.Header>

        <S.Body>
          {followers.length > 0 ? (
            followers.map((follower) => (
              <S.ProfileImgWrap key={follower.id} onClick={() => handleProfileClick(follower.id)}>
                <ProfileImg nickName={follower.nickName} size="42" />
                <span style={{ marginLeft: '10px' }}>{follower.nickName}</span>
              </S.ProfileImgWrap>
            ))
          ) : (
            "팔로워가 없습니다."
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
     background: rgba(13, 13, 13);
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

export default FollowerModal;
