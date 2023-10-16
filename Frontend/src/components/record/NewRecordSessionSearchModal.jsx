import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { SessionSearchComponent } from "@/components";
import ModalFooter from "@/components/layout/ModalFooter";
import { ProfileImg } from "@/components";
import { BsStars } from "react-icons/bs";

function NewRecordSessionSearchModal({ isModalOpen, setIsModalOpen }) {
  const navigate = useNavigate();
  const [selectedVideoData, setSelectedVideoData] = useState(null);
  const handleNewComposition = () => {
    navigate("/record/composition", {
      state: { id: selectedVideoData.videoId },
    });
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
              합주할 연주 찾기
            </Modal.Title>
            <div onClick={() => setIsModalOpen(false)}>X</div>
          </Modal.Header>
          <Modal.Body>
            <div style={{ textAlign: "center", color: "#ccc" }}>
              OnTheBlock에서 함께 합주할 연주 영상을 검색합니다.
            </div>
            <SessionSearchComponent
              setSelectedVideoData={setSelectedVideoData}
            />

            {selectedVideoData && (
              <>
                <h4 style={{ marginTop: "25px" }}>선택한 연주</h4>
                <hr></hr>

                <S.SearchItem>
                  <S.SearchItemLeft>
                    <div>{selectedVideoData.name}</div>
                  </S.SearchItemLeft>
                  <S.SearchItemRight>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "3px",
                      }}
                    >
                      <ProfileImg
                        nickName={selectedVideoData.member.nickname}
                        size={24}
                      />
                      <div>{selectedVideoData.member.nickname}</div>
                    </div>

                    <img
                      width="100px"
                      src={
                        selectedVideoData.thumbnail
                          ? selectedVideoData.thumbnail
                          : defaultThumbnailSrc
                      }
                    />
                  </S.SearchItemRight>
                </S.SearchItem>

                <hr></hr>
                <S.ButtonContainer>
                  <S.StartButton
                    disabled={!selectedVideoData}
                    onClick={() => {
                      handleNewComposition(selectedVideoData.videoId);
                    }}
                  >
                    <BsStars />
                    &nbsp;합주 시작하기
                  </S.StartButton>
                </S.ButtonContainer>
              </>
            )}
          </Modal.Body>
          <ModalFooter />
        </div>
      </Modal>
    </>
  );
}

const S = {
  SearchItem: styled.div`
    padding-left: 20px;
    padding-right: 20px;
    display: flex;
    align-items: center;
    gap: 20px;
    justify-content: space-between;
  `,

  SearchItemLeft: styled.div``,

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

export default NewRecordSessionSearchModal;
