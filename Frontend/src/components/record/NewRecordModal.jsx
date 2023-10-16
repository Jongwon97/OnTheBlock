import React from "react";
import SessionSrc from "@/assets/optionImgs/session.jpg";
import CompositionSrc from "@/assets/optionImgs/composition.jpg";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import ModalFooter from "@/components/layout/ModalFooter";

function NewRecordModal({
  isModalOpen,
  setIsModalOpen,
  setIsSessionSearchOpen,
}) {
  const navigate = useNavigate();

  const handleCompositionSelect = () => {
    setIsModalOpen(false);
    setIsSessionSearchOpen(true);
  };

  return (
    <>
      <S.Modal
        className="modal-dialog-centered"
        show={isModalOpen}
        onHide={() => setIsModalOpen(false)}
      >
        <div style={{ background: "black", color: "white" }}>
          <Modal.Header>
            <S.ModalTitle>연주 형태를 선택해 주세요!</S.ModalTitle>
            {/* <S.CloseButton onClick={() => setIsModalOpen(false)}>X</S.CloseButton> */}
          </Modal.Header>
          <Modal.Body>
            <S.OptionContainer>
              <S.Option onClick={() => navigate("/record/session")}>
                <S.OptionText>
                  솔로 연주 시작하기
                </S.OptionText>
                <S.DarkOverlay className="dark-overlay" />
                <S.OptionImg src={SessionSrc} />
              </S.Option>
              <S.Option onClick={handleCompositionSelect}>
                <S.OptionText>합주 시작하기</S.OptionText>
                <S.DarkOverlay className="dark-overlay" />
                <S.OptionImg src={CompositionSrc} />
              </S.Option>
            </S.OptionContainer>
          </Modal.Body>
          <ModalFooter />
        </div>
      </S.Modal>
    </>
  );
}

const S = {
  Modal: styled(Modal)`
    text-align: center;
    .modal-dialog {
    }
  `,

  ModalTitle: styled(Modal.Title)`
    font-weight: bold;
    width: 100%;
    text-align: center;
  `,

  OptionContainer: styled.div`
    display: flex;
    justify-content: center;
    gap: 0.8em;
  `,

  Option: styled.div`
    outline: 3px solid rgba (0, 0, 0, 0);

    display: flex;
    position: relative;
    justify-content: center;
    align-items: center;
    width: 400px;
    background: gray;
    cursor: pointer;

    &:hover {
      outline: 3px solid #f4b183;

      .dark-overlay {
        opacity: 0.5;
        transition: opacity 0.3s;
      }
    }
  `,

  OptionImg: styled.img`
    width: 100%;
    min-height: 100%;
  `,

  OptionText: styled.p`
    position: absolute;
    color: #d7d7d7;
    z-index: 999;
    font-size: 1em;
  `,

  DarkOverlay: styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    opacity: 1;
  `,

  OptionSpacer: styled.div`
    padding-bottom: 3px;
  `,
};

export default NewRecordModal;
