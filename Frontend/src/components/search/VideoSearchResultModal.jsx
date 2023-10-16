import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { SessionSearchComponent } from "@/components";
import ModalFooter from "@/components/layout/ModalFooter";
import { ProfileImg } from "@/components";
import { BsStars } from "react-icons/bs";
import { getVideo } from "@/api/video";
import * as hooks from "@/hooks";

function VideoSearchResultModal({
  isModalOpen,
  setIsModalOpen,
  keyword,
  videoSearchResult,
}) {
  const navigate = useNavigate();
  const defaultThumbnailSrc =
    "https://source.unsplash.com/1600x900/?succulent,green,dark,table";
  const { setIsVideoModalOpen } = hooks.videoModalState();
  const { setOpenVideoData } = hooks.openVideoState();

  const handleVideoSelect = async (videoId) => {
    const response = await getVideo(videoId);
    await setOpenVideoData(response.data);
    setIsVideoModalOpen();
  };

  return (
    <>
      <Modal
        className="modal-dialog-centered"
        show={isModalOpen}
        onHide={() => setIsModalOpen(false)}
      >
        <div style={{ background: "black", color: "white" }}>
          <Modal.Header>
            <Modal.Title style={{ color: "orange" }}>
              {keyword}에 대한 연주 검색 결과
            </Modal.Title>
            <div onClick={() => setIsModalOpen(false)}>X</div>
          </Modal.Header>
          <Modal.Body>
            <b>
              {videoSearchResult && (
                <div>총 {videoSearchResult.length}건의 검색 결과</div>
              )}
            </b>
            {videoSearchResult &&
              videoSearchResult.map((video) => (
                <S.SearchItem
                  key={video.videoId}
                  onClick={() => {
                    handleVideoSelect(video.videoId);
                  }}
                >
                  <S.SearchItemLeft>
                    <S.SearchVideoName>{video.name}</S.SearchVideoName>
                    <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "3px",
                    fontSize: '0.8em',
                    color: "#ccc"
                  }}
                >
                      <ProfileImg nickName={video.member.nickname} size={24} />
                      <div>{video.member.nickname}</div>
                    </div>
                  </S.SearchItemLeft>
                  <S.SearchItemRight>
                    

                    <img
                      width="100px"
                      src={
                        video.thumbnail ? video.thumbnail : defaultThumbnailSrc
                      }
                    />
                  </S.SearchItemRight>
                </S.SearchItem>
              ))}
            {videoSearchResult.length == 0 && (
              <S.EmptyResultMsg>조회된 영상 데이터가 없습니다.</S.EmptyResultMsg>
            )}
          </Modal.Body>
          <ModalFooter />
        </div>
      </Modal>
    </>
  );
}

const S = {
  EmptyResultMsg: styled.div`
  height: 108px;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.8;
    font-size: 0.8em;
  `,
  SearchItem: styled.div`
    cursor: pointer;
    border: 1px solid rgba(0, 0, 0, 0);
    border-bottom: 1px solid #222;
    border-radius: 3px;
    height: 64px;
    margin-left: 20px;
    margin-right: 30px;
    padding-left: 10px;
    padding-bottom: 5px;
    margin-top: 5px;
    display: flex;
    align-items: center;
    gap: 20px;
    justify-content: space-between;
    transition: border 0.3s;

    &:hover {
      border: 1px solid orange;
    }
  `,

  SearchItemLeft: styled.div`
    width: 100%;
    padding:0 5px;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
  `,

  
  SearchVideoName: styled.div`
    white-space:nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `,

  SearchItemRight: styled.div`
    display: flex;
    gap: 5px;
    align-items: center;
  `,

  ButtonContainer: styled.div`
    display: flex;
    justify-content: center;
  `,

  StartButton: styled.div`
    text-align: center;
    width: 120px;
    cursor: pointer;
    font-size: 0.8em;
    padding: 8px;
    border-radius: 50px;
    background: orange;
  `,
};

export default VideoSearchResultModal;
