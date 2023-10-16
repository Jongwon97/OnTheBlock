import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CgProfile as ProfileIcon } from "react-icons/cg";
import styled from "styled-components";
import LazyLoad from "react-lazyload";
import { ProfileImg } from "@/components";
import ScaleLoader from "react-spinners/ScaleLoader";
import * as hooks from "@/hooks";
import { getVideo } from "@/api/video";
import { IoMusicalNotes } from "react-icons/io5";
import {
  AiOutlineComment as CommentIcon,
  AiFillHeart as HeartIconFull,
  AiOutlineHeart as HeartIconEmpty,
  AiOutlineEye as WatchIcon,
} from "react-icons/ai";

function Thumbnail({ videoData }) {
  const navigate = useNavigate();
  const { openVideoId } = hooks.openVideoState();
  const { setOpenVideoId } = hooks.openVideoState();
  const { setIsVideoModalOpen } = hooks.videoModalState();
  const { openVideoData } = hooks.openVideoState();
  const { setOpenVideoData } = hooks.openVideoState();

  const handleThumbNailClick = async (videoId) => {
    const response = await getVideo(videoId);
    await setOpenVideoData(response.data);
    setIsVideoModalOpen();
  };

  const defaultThumbnailSrc =
    "https://source.unsplash.com/1600x900/?succulent,green,dark,table";

  return (
    <>
      <S.Wrap>
        {videoData && (
          <S.Card
            className="card"
            onClick={() => handleThumbNailClick(videoData.videoId)}
          >
            <LazyLoad
              style={{ minHeight: "200px" }}
              placeholderSrc={<ScaleLoader />}
            >
              <img
                style={{
                  minHeight: "200px",
                  maxHeight: "200px",
                  objectFit: "cover",
                }}
                className="card-img"
                src={
                  videoData.thumbnail
                    ? videoData.thumbnail
                    : defaultThumbnailSrc
                }
              />
            </LazyLoad>
            <S.DarkOverlay />

            <S.CardTopText className="card-img-overlay text-white">
              {videoData.song && (
                <p>
                  <IoMusicalNotes color="green" /> &nbsp;
                  {videoData.song.artist + " "}-{" " + videoData.song.name}
                </p>
              )}
            </S.CardTopText>
            <S.CardBody className="card-body">
              <S.VideoName>
                <b>{videoData.name}</b>
              </S.VideoName>

              <S.CardBodyBottom>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "2px" }}
                >
                  <ProfileImg nickName={videoData.member.nickname} size="24" />
                  <small style={{ marginLeft: "5px" }}>{videoData.member.nickname}</small>
                </div>
                <S.ActivityInfoTab>
                  <HeartIconFull size="16" />
                  &nbsp;
                  {videoData.likeCount}
                  &nbsp;&nbsp;&nbsp;
                  <WatchIcon size="16" />
                  &nbsp;
                  {videoData.watchCount}
                </S.ActivityInfoTab>
              </S.CardBodyBottom>
            </S.CardBody>
          </S.Card>
        )}
      </S.Wrap>
    </>
  );
}

const S = {
  Wrap: styled.div`
    cursor: pointer;
    border: 1.5px solid #333;
    border-radius: 7px;
  `,

  Card: styled.div`
    border: none;
    position: relative;
    padding: 0px;
    background: none;
    border-radius: 0 0 5px 5px;
  `,

  CardTopText: styled.div`
    color: #333;
    font-size: 0.8em;
    /*drop-shadow: */
  `,

  CardBody: styled.div`
    background: black;
    z-index: 2;
    color: white;
    border-radius: 0 0 7px 7px;
  `,

  CardBodyBottom: styled.div`
    margin-top: 3px;
    display: flex;
    justify-content: space-between;
  `,

  VideoName: styled.div`
    width: 100%;
    white-space:nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `,

  ActivityInfoTab:styled.div`
    font-size: 0.8em;
  `,

  DarkOverlay: styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    opacity: 1;
    transition: opacity 0.3s;

    &:hover {
      opacity: 0;
    }
  `,
};

export default Thumbnail;
