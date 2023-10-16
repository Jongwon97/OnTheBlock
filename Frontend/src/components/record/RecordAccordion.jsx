import styled from "styled-components";
import { Accordion, Button, Spinner } from "react-bootstrap";
import { IoOptionsOutline, IoPlaySkipForwardSharp } from "react-icons/io5";
import { BiSolidVolumeFull } from "react-icons/bi"
import { AiFillPicture } from "react-icons/ai"


function RecordAccordion({
  volumeComponent,
  syncComponent,
  thumbnailComponent,
}) {
  return (
    <>
      <S.Optiontitle>
        <b>
          <IoOptionsOutline /> Option
        </b>
      </S.Optiontitle>
      <S.Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <S.HeaderLabel>볼륨 조절</S.HeaderLabel>
            <S.HeaderDescription>
              &nbsp; &nbsp; <BiSolidVolumeFull />
              &nbsp;영상 음량을 조절합니다.
            </S.HeaderDescription>
          </Accordion.Header>
          <Accordion.Body>{volumeComponent()}</Accordion.Body>
        </Accordion.Item>
      </S.Accordion>
      <S.Accordion>
        <Accordion.Item eventKey="1">
          <Accordion.Header>
            <S.HeaderLabel>재생 위치 조정</S.HeaderLabel>
            <S.HeaderDescription>
              &nbsp; &nbsp; <IoPlaySkipForwardSharp />
              &nbsp; 영상의 시작 시간을 앞당기거나 뒤로 미룹니다.
            </S.HeaderDescription>
          </Accordion.Header>
          <Accordion.Body>{syncComponent()}</Accordion.Body>
        </Accordion.Item>
      </S.Accordion>
      <S.Accordion>
        <Accordion.Item>
          <Accordion.Header>
            <S.HeaderLabel>썸네일 저장</S.HeaderLabel>
            <S.HeaderDescription>
              &nbsp; &nbsp; <AiFillPicture />
              &nbsp; 영상으로부터 썸네일을 선택합니다.
            </S.HeaderDescription>
          </Accordion.Header>
        </Accordion.Item>
      </S.Accordion>
      <S.ForgedAccordion>{thumbnailComponent()}</S.ForgedAccordion>
    </>
  );
}

const S = {
  HeaderLabel: styled.span`
    color: #f4b183;
    font-weight: bold;
  `,
  HeaderDescription: styled.span`
    color: #d7d7d7;
    font-size: 0.8em;
  `,
  Optiontitle: styled.div`
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    text-align: left;
    padding: 8px;
    font-size: 1.2em;
    background: black;
  `,

  ForgedAccordion: styled.div`
    border-radius: 0 0 10px 10px;
    padding: 10px;
    min-height: 160px;
    background-color: #111111;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
  `,

  Accordion: styled(Accordion)`
    .accordion-item {
      border: 0px solid gray;
    }

    .accordion-header {
      background-color: rgba (0, 0, 0, 0);
    }

    .accordion-button {
      background-color: #111;
      border: 1px solid #222;
      color: white;
      &:not(.collapsed) {
        box-shadow: none;
      }

      ,
      &:focus {
        border-color: orange;
        box-shadow: orange;
      }
    }

    .accordion-body {
      border-radius: 0px;
      padding: 10px;
      min-height: 160px;
      background-color: #111111;
      color: white;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    width: 80vw;
    max-width: 840px;

    --bs-accordion-bg: rgba (0, 0, 0, 0);
    --bs-accordion-btn-focus-border-color: orange;
    --bs-accordion-btn-focus-box-shadow: orange;
    --bs-accordion-btn-active-icon: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23212529'%3e%3cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3e%3c/svg%3e");
  `,
};

export default RecordAccordion;
