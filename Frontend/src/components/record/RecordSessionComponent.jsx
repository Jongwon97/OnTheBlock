import { useReactMediaRecorder } from "react-media-recorder";
import { useEffect, useRef, useState } from "react";
import UploadRecordInfoModal from "./UploadRecordInfoModal";
import { Player, Thumbnail as RecordThumbnail } from "@remotion/player";
import html2canvas from "html2canvas";
import { Video, AbsoluteFill, Sequence } from "remotion";
import { Button } from "react-bootstrap";
import styled from "styled-components";
import { ImUpload2 as UploadIcon } from "react-icons/im";
import { BsMusicNote, BsFillRecordFill } from "react-icons/bs";
import SyncSlider from "./SyncSlider";
import * as hooks from "@/hooks";

import sessionImg from "@/assets/recordImgs/session.png";
import {
  SquareSlider,
  VolumeKnob,
  RecordIconBar,
  RecordAccordion,
  InputNumberTag,
} from "@/components/";
import _ from "lodash";
import { current } from "@reduxjs/toolkit";

function RecordSessionComponent() {
  const [isUploadRecordOpen, setIsUploadRecordOpen] = useState(false);
  const [totalFrame, setTotalFrame] = useState(9000);

  const { data } = hooks.recordVideoState();
  const { setData } = hooks.recordVideoState();
  const { setSession } = hooks.recordVideoState();
  const { thumbnailBlobUrl } = hooks.recordVideoState();
  const { setThumbnailBlobUrl } = hooks.recordVideoState();
  const { videoBlobUrl } = hooks.recordVideoState();
  const { setVideoBlobUrl } = hooks.recordVideoState();
  const { origins } = hooks.recordVideoState();
  const { setOrigins } = hooks.recordVideoState();

  const fps = 30;
  const { status, startRecording, stopRecording, mediaBlobUrl, previewStream } =
    useReactMediaRecorder({
      video: true,
    });

  const playerRef = useRef(null);
  const liveVideoRef = useRef(null);
  const hiddenFileInput = useRef(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [currentBlobUrl, setCurrentBlobUrl] = useState(null);

  const [startPoint, setStartPoint] = useState(0);
  const thumbnailRef = useRef(null);
  const resultVideoRef = useRef(null);

  /* 파일업로드 관련 */
  const handleUploadClick = () => {
    hiddenFileInput.current.click();
  };

  const volumeRef = useRef({
    BACKGROUND: 100,
  });

  const handleVolumeChange = (e, position) => {
    volumeRef.current[position] = e;
  };

  const handleManualFileUpload = (e) => {
    if (!e.target.files[0].type.startsWith('video/')) {
      alert('올바르지 않은 파일 유형입니다! 동영상 파일만 업로드해주세요.');
      return;
    }else if (e.target.files[0].size > 104857600) {
      alert('100MB 미만의 파일만 첨부해주세요.');
      return;
    }else{
      const newFileUrl = window.URL.createObjectURL(e.target.files[0]);
      setFileUrl(newFileUrl);
      pausePreview();
    }
  };

  useEffect(() => {
    setCurrentBlobUrl(fileUrl);
  }, [fileUrl]);

  const getThumbnail = async () => {
    if (!thumbnailRef.current) {
      return null;
    }
    return html2canvas(thumbnailRef.current, { useCORS: true }).then(
      (canvas) => {
        const url = canvas.toDataURL();
        return url;
      }
    );
  };

  const RecordLivePreview = ({ stream }) => {
    useEffect(() => {
      if (liveVideoRef.current && stream) {
        liveVideoRef.current.srcObject = stream;
      }
    }, [stream]);

    return (
      <S.LiveVideoContainer>
        <video ref={liveVideoRef} autoPlay width="100%" />
      </S.LiveVideoContainer>
    );
  };

  const resultVideo = () => {
    return (
      <>
        <AbsoluteFill>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              width: "100%",
              height: "100%",
            }}
          >
            {(status === "stopped" || status === "idle") && currentBlobUrl ? (
              <div>
                <Sequence from={Math.max(0, startPoint)} layout="none">
                  <Video
                    ref={resultVideoRef}
                    volume={Math.max(0, volumeRef.current.BACKGROUND / 100)}
                    startFrom={Math.max(0, -startPoint)}
                    src={currentBlobUrl}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      width: "100%",
                    }}
                  />
                </Sequence>
              </div>
            ) : (
              <></>
            )}
            {(status === "idle" || status === "acquiring_media") &&
              !currentBlobUrl && (
                <S.Introduction>
                  <img src={sessionImg} />
                  <p>
                    <BsMusicNote color="green" />
                    &nbsp; 솔로 연주에 오신 것을 환영합니다! &nbsp;
                  </p>
                  <div>
                    - 녹음 버튼
                    <BsFillRecordFill color="red" />을 누르고, 자신있는 악기를
                    연주해 주세요.
                  </div>
                  <div>
                    - 업로드 버튼
                    <UploadIcon color="gray" />을 누르면 이미 연주한 영상을
                    업로드할 수 있습니다.
                  </div>
                  <div>
                    - 높은 음질을 위해 이어폰과 마이크 활용을 권장합니다.
                  </div>
                  <div>
                    <a href="https://www.vecteezy.com/free-vector/lines">
                      Lines Vectors by Vecteezy
                    </a>
                  </div>
                </S.Introduction>
              )}
          </div>
        </AbsoluteFill>
      </>
    );
  };

  /* 녹화 시작 */
  const handleStartRecording = async (e) => {
    const hasCamera = await checkCamera();
    if (!hasCamera) {
      alert("연결된 카메라가 없어요.");
      return;
    }
    await startRecording();
    playerRef.current?.play(e);
  };

  const checkCamera = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasCamera = devices.some((device) => device.kind === "videoinput");
      return hasCamera;
    } catch (error) {
      alert("Error checking camera availability:", error);
      return false;
    }
  };

  /* 녹화 중지 */
  const handleStopRecording = () => {
    stopRecording();
  };

  useEffect(() => {
    setCurrentBlobUrl(mediaBlobUrl);
    pausePreview();
  }, [mediaBlobUrl]);

  /* 재생 시간 관련 */
  const getDurationCountRef = useRef(0);

  const refreshDuration = () => {
    resultVideoRef.current.currentTime = Number.MAX_SAFE_INTEGER;
    resultVideoRef.current.currentTime = 0;
    getDuration();
  };

  const getDuration = () => {
    
    if (!resultVideoRef.current) {
      return false;
    }

    resultVideoRef.current.currentTime = 0;

    if (getDurationCountRef.current === 3) {
      getDurationCountRef.current = 0;
      setCurrentBlobUrl(currentBlobUrl);
      setIsDurationProcessing(false);
      setIsDurationValid(false);
      //안 될 때는 얼마를 기다리든 안 된다. (현재 URL이 올바른 파일인가?)
      //setFrameCount(9000);
      return;
    }
    const duration = resultVideoRef.current.duration;
    if (duration === Infinity) {
      getDurationCountRef.current++;
      setTimeout(getDuration, 1000);
    } else {
      //float값을 받았을 때만.
      getDurationCountRef.current = 0;
      setTotalFrame(Math.floor(duration * fps));
      setIsDurationProcessing(false);
      setIsDurationValid(true);
    }
  };

  const [isDurationProcessing, setIsDurationProcessing] = useState(false);
  const [isDurationValid, setIsDurationValid] = useState(true);

  useEffect(() => {
    setIsDurationProcessing(true);
    setTimeout(getDuration, 1000);
  }, [currentBlobUrl]);

  const pausePreview = () => {
    playerRef.current.pause();
    playerRef.current.seekTo(0);
  };

  /* 정보 저장 */
  const handleSaveRecording = async () => {
    fetch(currentBlobUrl)
    .then(response => response.blob())
    .then(blob => {
      const fileSize = blob.size;

      if (fileSize > 104857600) {
        if(confirm('파일이 100MB를 초과했습니다. 녹화된 파일을 삭제하지 않고 로컬 PC에 저장할까요? 저장을 원하시면 [예]를 눌러 주세요.')){
          const link = document.createElement('a');
          link.href = currentBlobUrl;
          link.download = 'recording.' + (currentBlobUrl.split('/').pop()).split('.').pop();

          document.body.appendChild(link);
          
          // Trigger a click event on the link
          link.click();
          
          // Remove the link from the document
          document.body.removeChild(link);
        }
      } 
    })
    .catch(error => alert('파일 사이즈 측정 중 에러가 발생했습니다:', error));

    const newThumbnailBloburl = await getThumbnail().then((result) => {
      return result;
    });

    setThumbnailBlobUrl(newThumbnailBloburl);
    setVideoBlobUrl(currentBlobUrl);
    setSession({
      instrumentId: 0,
      volume: Math.max(0, volumeRef.current.BACKGROUND),
      startPoint: startPoint,
      totalFrame: totalFrame,
      sessionPosition: "BACKGROUND",
    });
    setIsUploadRecordOpen(true);
  };

  const VolumeComponent = () => {
    return (
      <VolumeKnob
        recordingComposition={false}
        handleVolumeChange={(e, position) => {
          handleVolumeChange(e, position);
        }}
      />
    );
  };

  const SyncComponent = () => {
    return (
      <SyncSlider
        position={"BACKGROUND"}
        startPoint={startPoint}
        setStartPoint={setStartPoint}
        totalFrame={totalFrame}
        max={totalFrame + (startPoint > 0 ? startPoint : 0)}
      />
    );
  };

  const ThumbnailComponent = () => {
    const handleThumbnailKeyDown = (e) => {
      if (e.keyCode == 37) {
        setThumbnailPoint(thumbnailPoint - 1);
      } else if (e.keyCode == 39) {
        setThumbnailPoint(thumbnailPoint + 1);
      }
    };
    const [thumbnailPoint, setThumbnailPoint] = useState(0);
    return (
      <div
        style={{
          maxWidth: "480px",
        }}
      >
        <div style={{ background: "gray" }}>
          <div ref={thumbnailRef}>
            <RecordThumbnail
              style={{ background: "black", width: "100%" }}
              component={resultVideo}
              compositionWidth={1920}
              compositionHeight={1080}
              frameToDisplay={thumbnailPoint}
              durationInFrames={120}
              fps={30}
            />
          </div>
        </div>
          <div style={{marginTop: "3px", display:"flex", flexDirection:"column", alignItems:"center"}}>
        <SquareSlider
          type="range"
          min="0"
          max={totalFrame}
          width="100%"
          value={thumbnailPoint}
          onChange={(e) => {
            setThumbnailPoint(Number(e.target.value));
          }}
        />
        <div style={{ marginTop: "10px" }}></div>
        <InputNumberTag
          value={thumbnailPoint}
          onChange={(e) => setThumbnailPoint(Number(e.target.value))}
          onKeyDown={(e) => {
            handleThumbnailKeyDown(e);
          }}
        />
        </div>
      </div>
    );
  };

  return (
    <S.Wrap>
      {/* status: "idle" "acquiring_media" "stopped"*/}
      <div>
        <div
          style={{
            position: "relative",
            background: "black",
            width: "960px",
            height: "540px",
          }}
        >
          <div></div>
          {status !== "stopped" ? (
            <>
              <RecordLivePreview stream={previewStream} />
            </>
          ) : (
            <></>
          )}
          <Player
            ref={playerRef}
            controls={Boolean(currentBlobUrl) && status !== "recording"}
            durationInFrames={Math.max(1, totalFrame + startPoint)}
            component={resultVideo}
            compositionWidth={1920}
            compositionHeight={1080}
            fps={fps}
            style={{
              top: 0,
              left: 0,
              position: "absolute",
              width: 960,
              height: 540,
            }}
          />
        </div>
        <RecordIconBar
          playerRef={playerRef}
          status={status}
          handleStartRecording={handleStartRecording}
          handleStopRecording={handleStopRecording}
          handleUploadClick={handleUploadClick}
        />
      </div>
      <input
        type="file"
        accept="video/mp4, video/webm, video/avi, video/mkv, video/mov"
        onChange={handleManualFileUpload}
        ref={hiddenFileInput}
        style={{ display: "none" }}
      />

      <S.MsgBox>
        {currentBlobUrl &&
          (isDurationProcessing ? (
            <>비디오 메타데이터를 불러오는 중...</>
          ) : isDurationValid ? (
            <>
              <S.VideoPreparedMsg>
                <div>
                  <b>영상 준비 완료!</b>
                </div>
                <div>
                  미리보기와 옵션을 확인해 보세요. 저장하기 버튼을 눌러 연주를
                  저장합니다.
                </div>
              </S.VideoPreparedMsg>{" "}
            </>
          ) : (
            <S.InvalidDurationMsg onClick={refreshDuration}>
              <div>
                일시적 오류 : 비디오로부터 올바른 메타데이터를 불러오지
                못하였습니다.
              </div>
              <div>기본 프레임 수를 9000(5분)으로 세팅합니다.</div>
            </S.InvalidDurationMsg>
          ))}
        {/**파일 용량 초과 : 로컬 저장 기능을 준비중입니다. */}
      </S.MsgBox>

      <div className="mt-5">
        {currentBlobUrl && (
          <>
            <RecordAccordion
              volumeComponent={VolumeComponent}
              syncComponent={SyncComponent}
              thumbnailComponent={ThumbnailComponent}
            />
            {/*onKeyDown={(e) => handleNumberKeyDown(e)} */}

            <div style={{ textAlign: "center" }}>
              <Button onClick={handleSaveRecording}>
                저장하기
                {/* 파일 용량 초과 시 로컬 저장으로 대체할 것. 로직 업데이트할 것. */}
              </Button>
            </div>
          </>
        )}
      </div>
      <UploadRecordInfoModal
        isModalOpen={isUploadRecordOpen}
        setIsModalOpen={setIsUploadRecordOpen}
      />
    </S.Wrap>
  );
}

const S = {
  Wrap: styled.div`
    display: flex;
    max-width: 100%;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  `,

  Introduction: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    > img {
      width: 28%;
      height: 300px;
    }

    > p {
      font-size: 2.4em;
      font-weight: bold;
    }

    > div {
      color: #d7d7d7;
      font-size: 1.6em;
    }
  `,

  MsgBox: styled.div`
    margin-top: 32px;
    display: flex;
    border-radius: 3px;

    > div {
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 10px;
    }
  `,

  VideoPreparedMsg: styled.div`
    font-size: 0.8em;
    background: #b0c4de;
    outline: 2px solid #4682b4;
    color: #002147;
    outline-offset: -5px;
    opacity: 1;
    transition: 0.3s opacity;
  `,

  InvalidDurationMsg: styled.div`
    color: #60262c;
    font-size: 0.8em;
    outline: 2px solid #f0d09e;
    outline-offset: -5px;
    background-color: #fae2a5;
    cursor: pointer;
    opacity: 1;
    transition: 0.3s opacity;
  `,

  Optiontitle: styled.div`
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    text-align: left;
    padding: 8px;
    font-size: 1.2em;
    background: black;
  `,

  LiveVideoContainer: styled.div`
    width: 960px;
    height: 540px;
    display: flex;
    align-items: center;
    overflow: hidden;
  `,

  IconBar: styled.div`
    display: flex;
    background: #373737;
    justify-content: space-between;
  `,
};

export default RecordSessionComponent;
