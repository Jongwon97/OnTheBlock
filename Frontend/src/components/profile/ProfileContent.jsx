import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { ThumbnailGrid } from "@/components";
import { Swiper, SwiperSlide } from "swiper/react";
import { getMyUploadVideos } from "@/api/video";
import * as hooks from "@/hooks";


function ProfileContent() {
  const navigate = useNavigate();
  const [ uploadVideoList, setUploadVideoList ] = useState(null);
  const { memberId } = useParams();

  useEffect(() => {
    getMyUploadVideos(memberId).then((response) => {
      setUploadVideoList(response.data);
    });
  }, []);
  
  return (
    <>
      <S.Wrap>
        <S.Card>
          <S.CardBody>
            <S.ThumbnailContainer>
              <h5>사용자가 업로드한 동영상</h5>
              <ThumbnailGrid videoList={uploadVideoList}></ThumbnailGrid>
            </S.ThumbnailContainer>
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
    border-radius: 20px;
    margin-bottom: 25px;
    background: rgba(13, 13, 13);
    color: white;
    align-items: center;
  `,

  ThumbnailContainer: styled.div`
    padding: 48px 72px 48px 72px;
    display: flex;
    justify-content: center;
    flex-direction: column;
  `,
};

export default ProfileContent;
