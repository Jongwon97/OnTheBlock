import { BsRecord2Fill, BsFillStopCircleFill } from "react-icons/bs";
import { Button, Spinner } from "react-bootstrap";
import styled from "styled-components";

import { ImUpload2 as UploadIcon } from "react-icons/im";

function RecordIconBar(props) {
  return (
    <S.Wrap>
      <div></div>
      <div>
        {props.status === "idle" || props.status === "stopped" ? (
          <>
            <S.ToggleRecordButton
              onClick={(e) => props.handleStartRecording(e)}
            >
              <S.Record />
            </S.ToggleRecordButton>
          </>
        ) : props.status === "recording" ? (
          <S.ToggleRecordButton onClick={(e) => props.handleStopRecording(e)}>
            <S.Stop />
          </S.ToggleRecordButton>
        ) : (
          <Spinner size="48" />
        )}
      </div>
      <div>
        <div
          style={{ cursor: "pointer" }}
          onClick={() => props.handleUploadClick()}
        >
          <S.SideButton>
            <UploadIcon color="white" size="24" />
            <S.SideBtnToolTip className="tooltip">직접 파일 업로드</S.SideBtnToolTip>
          </S.SideButton>
        </div>
      </div>
      {/*
          <Button
            className="btn-dark"
            onClick={(e) => props.handleStopRecording(e)}
          >
            <BsFillStopCircleFill color="#f7f7f7" size="32" />
          </Button> */}
    </S.Wrap>
  );
}

const S = {
  Wrap: styled.div`
    display: grid;
    background: black;
    grid-template-columns: 3fr 1fr 3fr;
    height: 3.6em;
    padding: 2px;

    > * {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `,
  ToggleRecordButton: styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid white;
    padding: 2px;
    border-radius: 100%;
    width: 2.8em;
    cursor: pointer;
  `,

  Record: styled.div`
    background: red;
    width: 100%;
    height: 100%;
    padding-top: 100%;
    border-radius: 100%;
  `,

  Stop: styled.div`
    background: red;
    width: 50%;
    margin: 25%;
    padding-top: 50%;
    border-radius: 20%;
    display: flex;
    align-items: center;
    justify-content: center;
  `,

  SideButton: styled.div`
    position: relative;
    &: hover .tooltip {
      opacity: 100;
      transition: opacity 0.5s;
    }
  `,

  SideBtnToolTip: styled.div`
    text-align: center;
    background: black;
    position: absolute;
    top: 100%;
    left: -50px;
    padding: 5px;
    width: 148px;
    border-radius: 20px;
    opacity: 0;
  `,
};

export default RecordIconBar;
