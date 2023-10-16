import React from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import { useLocation } from "react-router-dom";
import UploadRecordInfoModal from "./UploadRecordInfoModal";
import { useEffect, useRef, useState } from "react";
import { Player, Thumbnail as RecordThumbnail } from "@remotion/player";
import { Img, Video, AbsoluteFill, Sequence } from "remotion";
import { Button, Spinner } from "react-bootstrap";
import styled from "styled-components";
import { BsRecord2Fill, BsFillStopCircleFill } from "react-icons/bs";
import { ImUpload2 as UploadIcon } from "react-icons/im";
import SyncSlider from "./SyncSlider";
import { BsMusicNote, BsFillRecordFill } from "react-icons/bs";
import { IoMusicalNotes } from "react-icons/io5";
import { getVideo } from "@/api/video";
import * as hooks from "@/hooks";
import compositionImg from "@/assets/recordImgs/composition.png";
import {
  SquareSlider,
  VolumeKnob,
  RecordIconBar,
  RecordAccordion,
  InputNumberTag,
} from "@/components/";
import html2canvas from "html2canvas";
import _ from "lodash";

function RecordCompositionComponent() {
  const [isUploadRecordOpen, setIsUploadRecordOpen] = useState(false);
  const [maxFrameCount, setMaxFrameCount] = useState(9000);
  const minFrameCount = useRef(Number.MAX_SAFE_INTEGER);
  const [recordingTotalFrame, setRecordingTotalFrame] = useState(9000);

  const thumbnailRef = useRef(null);
  const resultVideoRef = useRef(null);

  const { data } = hooks.recordVideoState();
  const { setData } = hooks.recordVideoState();
  const { setSession } = hooks.recordVideoState();
  const { thumbnailBlobUrl } = hooks.recordVideoState();
  const { setThumbnailBlobUrl } = hooks.recordVideoState();
  const { videoBlobUrl } = hooks.recordVideoState();
  const { setVideoBlobUrl } = hooks.recordVideoState();
  const { origins } = hooks.recordVideoState();
  const { setOrigins } = hooks.recordVideoState();

  const [startPointBG, setStartPointBG] = useState(0);
  const [startPointTL, setStartPointTL] = useState(0);
  const [startPointTR, setStartPointTR] = useState(0);
  const [startPointBL, setStartPointBL] = useState(0);
  const [startPointBR, setStartPointBR] = useState(0);

  const setStartPointMap = 
    {
      BACKGROUND: setStartPointBG,
      TOP_LEFT: setStartPointTL,
      BOTTOM_LEFT: setStartPointBL,
      TOP_RIGHT: setStartPointTR,
      BOTTOM_RIGHT: setStartPointBR,
    };

  useEffect(() => {
    let currMaxFrame = 0;
    if(currentBlobUrl){
     currMaxFrame = recordingTotalFrame + startPointBG;
     //Infinity 걸렸을 때 처리가 어떻게 되나?
    }

    if(sessionsMap.has("TOP_LEFT")){
      currMaxFrame = Math.max(
        sessionsMap.get("TOP_LEFT").totalFrame + startPointTL,
        currMaxFrame
      );
    }

    if (sessionsMap.has("TOP_RIGHT")) {
      
      currMaxFrame = Math.max(sessionsMap.get("TOP_RIGHT").totalFrame + startPointTR,
        currMaxFrame
      );
    }

    if (sessionsMap.has("BOTTOM_LEFT")) {
      
      currMaxFrame = Math.max(sessionsMap.get("BOTTOM_LEFT").totalFrame + startPointBL,
        currMaxFrame
      );
    }

    if (sessionsMap.has("BOTTOM_RIGHT")) {
      
      currMaxFrame = Math.max(sessionsMap.get("BOTTOM_RIGHT").totalFrame + startPointBR,
        currMaxFrame
      );
    }

    setMaxFrameCount(currMaxFrame);
  }, [
    recordingTotalFrame,
    startPointBG,
    startPointTL,
    startPointTR,
    startPointBL,
    startPointBR,
  ]);

  const location = useLocation();

  if (location.state !== null) {
    //alert(location.state.id);
  } else {
    alert("합주 정보 없음 : 잘못된 접근입니다.");
  }

  const videoId = location.state.id;

  const fps = 30;
  const { status, startRecording, stopRecording, mediaBlobUrl, previewStream } =
    useReactMediaRecorder({
      video: true,
    });

  const playerRef = useRef(null);
  const liveVideoRef = useRef(null);
  const hiddenFileInput = useRef(null);
  const [fileUrl, setFileUrl] = useState(null);

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

  const [compositionVideoData, setCompositionVideoData] = useState(null);
  const [recordingPosition, setRecordingPosition] = useState("BACKGROUND");
  const [sessionsMap, setSessionsMap] = useState(new Map());
  const [currentBlobUrl, setCurrentBlobUrl] = useState(null);

  const videoPositions = [
    "BACKGROUND",
    "TOP_LEFT",
    "BOTTOM_LEFT",
    "TOP_RIGHT",
    "BOTTOM_RIGHT",
  ];

  useEffect(() => {
    const recieveVideoData = async (videoId) => {
      const response = await getVideo(videoId);
      await setCompositionVideoData(response.data);

      const sessionsData = response.data.sessions;
      const convertedSessionsMap = await convertSessionsToMap(sessionsData);
      const modifiedSessionsMap = await modifySessionsMap(convertedSessionsMap);
      setSessionsMap(modifiedSessionsMap);
    };
    recieveVideoData(videoId);
  }, []);

  useEffect(()=>{
    
  },[compositionVideoData])
  
  useEffect(() => {
  }, [sessionsMap]);

  //VideoModal과 거의 겹치는 로직.
  const convertSessionsToMap = (sessionsData) => {
    const tempSessionsMap = new Map();
    for (const session of sessionsData) {
      const sessionPosition = session.sessionPosition;
      tempSessionsMap.set(sessionPosition, session);
    }
    return tempSessionsMap;
  };

  const modifySessionsMap = (modSessionsMap) => {
    let currMaxFrameCount = 0;
    let frameCount = 0;
    for (const position of videoPositions) {
      if (position === "BACKGROUND") {
        continue;
      } else if (!modSessionsMap.has(position)) {
        modSessionsMap.set(position, modSessionsMap.get("BACKGROUND"));
        modSessionsMap.delete("BACKGROUND");    

        volumeRef.current[position] = modSessionsMap.get(position).volume;
        setStartPointMap[position](modSessionsMap.get(position).startPoint);

        frameCount =
          modSessionsMap.get(position).totalFrame +
          modSessionsMap.get(position).startPoint;

        break;
      } else {
        volumeRef.current[position] = modSessionsMap.get(position).volume;
        setStartPointMap[position](modSessionsMap.get(position).startPoint);

        frameCount =
          modSessionsMap.get(position).totalFrame +
          modSessionsMap.get(position).startPoint;

      }
      
      currMaxFrameCount = Math.max(frameCount, currMaxFrameCount);
    }

    setMaxFrameCount(currMaxFrameCount);

    return modSessionsMap;
  };

  
  /* 재생 시간 관련 */
  const getDurationCountRef = useRef(0);

  const refreshDuration = () => {
    resultVideoRef.current.currentTime = Number.MAX_SAFE_INTEGER;
    resultVideoRef.current.currentTime = 0;
    getDuration();
  };

  const getDuration = () => {
    
    if (resultVideoRef.current === null) {
      return false;
    }
    if (getDurationCountRef.current === 3) {
      getDurationCountRef.current = 0;
      setCurrentBlobUrl(currentBlobUrl);
      setIsDurationProcessing(false);
      setIsDurationValid(false);
      setRecordingTotalFrame(9000);
      return;
    }
    const duration = resultVideoRef.current.duration;

    if (duration === Infinity) {
      getDurationCountRef.current++;
      setTimeout(getDuration, 1000);
    } else {
      getDurationCountRef.current = 0;
      setRecordingTotalFrame(Math.floor(duration * fps));
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


  /* 볼륨 조절 관련 */
  const volumeRef = useRef({
    BACKGROUND: 100,
    TOP_LEFT: 100,
    TOP_RIGHT: 100,
    BOTTOM_LEFT: 100,
    BOTTOM_RIGHT: 100,
  });

  const handleVolumeChange = (e, position) => {
    volumeRef.current[position] = e;
  };

  /* 파일업로드 관련 */
  const handleUploadClick = () => {
    hiddenFileInput.current.click();
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


  const addVideoData = () => {
    if (compositionVideoData.sessions.length >= 5) {
      alert("session의 갯수가 5개면 합주 추가 불가");
      return; 
    }
  };

  const countSessions = () => {
    //To-Do :
  };


  // 실시간 미리보기 영상 컴포넌트. 현재 코드대로면 항상 배경에 깔려 있다.
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

  // 실시간 미리보기 할때 영상 틀어줄 겸 녹화 완료 영상 컴포넌트.
  const resultVideo = () => {
    return (
      <>
        <AbsoluteFill>
          <S.Grid>
            <S.Background>
              {(status === "stopped" || status === "idle") && currentBlobUrl ? (
                <Sequence
                  from={Math.max(0, startPointBG)}
                  style={{ position: "static", width: "100%" }}
                >
                  <Video
                    ref={resultVideoRef}
                    src={currentBlobUrl}
                    volume={Math.max(0, volumeRef.current.BACKGROUND / 100)}
                    startFrom={Math.max(0, -startPointBG)}
                    style={{ width: "100%" }}
                  />
                </Sequence>
              ) : (
                <div style={{ background: "transparent" }}></div>
              )}
              {(status === "idle" || status === "acquiring_media") &&
                !currentBlobUrl && (
                  <S.Introduction>
                    <img src={compositionImg} />
                    <p>
                      <BsMusicNote color="green" />
                      &nbsp; 합주에 오신 것을 환영합니다! &nbsp;
                    </p>
                    <div>
                      - 녹음 버튼
                      <BsFillRecordFill color="red" />을 눌러, 왼쪽의 연주
                      영상들과 함께 합주해보세요.
                    </div>
                    <div>
                      - 업로드 버튼
                      <UploadIcon color="gray" />을 누르면 이미 연주한 영상을
                      업로드할 수 있습니다.
                    </div>
                    <div>
                      - 높은 음질을 위해 이어폰과 마이크 활용을 권장합니다.
                    </div>
                    <a href="https://www.freepik.com/free-vector/role-audition-abstract-concept-vector-illustration-actor-audition-acting-skills-demonstration-cinematography-main-cast-talent-search-introduction-interview-leading-role-abstract-metaphor_24122429.htm#query=concert%20line%20art&position=13&from_view=search&track=ais">
                      Image by vectorjuice
                    </a>
                  </S.Introduction>
                )}
            </S.Background>
            <S.TopLeft>
              {sessionsMap.has("TOP_LEFT") && (
                <Sequence
                  style={{ position: "static", width: "100%", height: "100%" }}
                  from={Math.max(0, startPointTL)}
                >
                  <Video
                    src={sessionsMap.get("TOP_LEFT").sessionUrl}
                    volume={Math.max(0, volumeRef.current.TOP_LEFT / 100)}
                    startFrom={Math.max(0, -startPointTL)}
                    style={{
                      width: "100%",
                    }}
                  />
                </Sequence>
              )}
            </S.TopLeft>
            <S.BottomLeft>
              {sessionsMap.has("BOTTOM_LEFT") && (
                <Sequence
                  style={{ position: "static", width: "100%", height: "100%" }}
                  from={Math.max(0, startPointBL)}
                >
                  <Video
                    src={sessionsMap.get("BOTTOM_LEFT").sessionUrl}
                    volume={Math.max(0, volumeRef.current.BOTTOM_LEFT / 100)}
                    startFrom={Math.max(0, -startPointBL)}
                    style={{
                      width: "100%",
                    }}
                  />
                </Sequence>
              )}
            </S.BottomLeft>
            <S.TopRight>
              {sessionsMap.has("TOP_RIGHT") && (
                <Sequence
                  from={Math.max(0, startPointTR)}
                  style={{ position: "static", width: "100%", height: "100%" }}
                >
                  <Video
                    src={sessionsMap.get("TOP_RIGHT").sessionUrl}
                    volume={Math.max(0, volumeRef.current.TOP_RIGHT / 100)}
                    startFrom={Math.max(0, -startPointTR)}
                    style={{
                      width: "100%",
                    }}
                  />
                </Sequence>
              )}
            </S.TopRight>
            <S.BottomRight>
              {sessionsMap.has("BOTTOM_RIGHT") && (
                <Sequence
                  from={Math.max(0, startPointBR)}
                  style={{ position: "static", width: "100%", height: "100%" }}
                >
                  <Video
                    src={sessionsMap.get("BOTTOM_RIGHT").sessionUrl}
                    volume={Math.max(0, volumeRef.current.BOTTOM_RIGHT / 100)}
                    startFrom={Math.max(0, -startPointBR)}
                    style={{
                      width: "100%",
                    }}
                  />
                </Sequence>
              )}
            </S.BottomRight>
          </S.Grid>
        </AbsoluteFill>
      </>
    );
  };

  const handleStartRecording = async () => {
    
    const hasCamera = await checkCamera();
    if (!hasCamera) {
      alert("연결된 카메라가 없어요.");
      return;
    }
    await startRecording();
    playerRef.current.play();

    // to-do: setTimeout 사용하여 3초(사용자 설정) 대기 후 시작.
  };

  //RecordSession과 중복 로직.
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

  const handleStopRecording = (e) => {
    setStartPointBG(0);
    stopRecording();
  };

  useEffect(() => {
    setCurrentBlobUrl(mediaBlobUrl);
    pausePreview();
  }, [mediaBlobUrl]);

  const pausePreview = () => {
    playerRef.current.pause();
    playerRef.current.seekTo(0);
  };

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

    //새롭게 업로드한 파일 정보 세팅.
    setSession({
      instrumentId: 0,
      volume: Math.max(0, volumeRef.current[recordingPosition]),
      startPoint: startPointBG,
      totalFrame: recordingTotalFrame,
      sessionPosition: recordingPosition,
    });

    const origins = prepareOriginInfo(sessionsMap);
    setOrigins(origins);
    setIsUploadRecordOpen(true);
  };

  const prepareOriginInfo = (sessionsMap) => {
    const origins = [];
    for (const position of videoPositions) {
      if (!sessionsMap.get(position)) {
        continue;
      }
      const item = { ...sessionsMap.get(position) };
      item["sessionPosition"] = position;
      item["volume"] = volumeRef.current[position];
      
      switch(position){
        case "TOP_LEFT":
          item["startPoint"] = startPointTL;
          break;
          case "TOP_RIGHT":
          item["startPoint"] = startPointTR;
          break;
          case "BOTTOM_LEFT":
          item["startPoint"] = startPointBL;
          break;
          case "BOTTOM_RIGHT":
          item["startPoint"] = startPointBR;
          break;
      }
      origins.push(item);
    }
    return origins;
  };

  const VolumeComponent = () => {
    return (
      <>
        <VolumeKnob
          recordingComposition={true}
          sessionsMap={sessionsMap}
          sessionVolumes={volumeRef.current}
          handleVolumeChange={(e, position) => {
            handleVolumeChange(e, position);
          }}
        />
      </>
    );
  };

  const SyncComponent = () => {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          원하는 위치별로&nbsp;
          <span style={{ color: "orange" }}> 주황색 슬라이드&nbsp; </span>
          <div style={{ width: "30px" }}>
            <SquareSlider />
          </div>
          &nbsp; 를 움직여,
        </div>
        <div>영상별 시작 위치를 조절합니다.</div>
        <div className="mt-4"></div>
        <SyncSlider
          position={"BACKGROUND"}
          startPoint={startPointBG}
          setStartPoint={setStartPointBG}
          totalFrame={recordingTotalFrame}
          max={maxFrameCount}
        />
        {sessionsMap.get("TOP_LEFT") && (
          <SyncSlider
            position={"TOP_LEFT"}
            startPoint={startPointTL}
            setStartPoint={setStartPointTL}
            totalFrame={sessionsMap.get("TOP_LEFT").totalFrame}
            max={maxFrameCount}
          />
        )}
        {sessionsMap.get("TOP_RIGHT") && (
          <SyncSlider
            position={"TOP_RIGHT"}
            startPoint={startPointTR}
            setStartPoint={setStartPointTR}
            totalFrame={sessionsMap.get("TOP_RIGHT").totalFrame}
            max={maxFrameCount}
          />
        )}
        {sessionsMap.get("BOTTOM_LEFT") && (
          <SyncSlider
            position={"BOTTOM_LEFT"}
            startPoint={startPointBL}
            setStartPoint={setStartPointBL}
            totalFrame={sessionsMap.get("BOTTOM_LEFT").totalFrame}
            max={maxFrameCount}
          />
        )}
        {sessionsMap.get("BOTTOM_RIGHT") && (
          <SyncSlider
            position={"BOTTOM_RIGHT"}
            startPoint={startPointBR}
            setStartPoint={setStartPointBR}
            totalFrame={sessionsMap.get("BOTTOM_RIGHT").totalFrame}
            max={maxFrameCount}
          />
        )}
      </div>
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
      <div>
        <div style={{ maxWidth: "480px" }}>
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
          <div
            style={{
              marginTop: "3px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <SquareSlider
              type="range"
              min="0"
              max={recordingTotalFrame}
              width="100%"
              value={thumbnailPoint}
              onChange={(e) => {
                setThumbnailPoint(Number(e.target.value));
              }}
            />
            <InputNumberTag
              value={thumbnailPoint}
              onChange={(e) => setThumbnailPoint(Number(e.target.value))}
              onKeyDown={(e) => {
                handleThumbnailKeyDown(e);
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <S.Wrap>
      {/* status: "idle" "acquiring_media" "stopped"*/}
      <div>
        <S.VideoContainer>
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
            component={resultVideo}
            durationInFrames={Math.max(maxFrameCount, 1)}
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
        </S.VideoContainer>
        <RecordIconBar
          playerRef={playerRef}
          status={status}
          handleStartRecording={handleStartRecording}
          handleStopRecording={handleStopRecording}
          handleUploadClick={handleUploadClick}
        />
        <input
          type="file"
          accept="video/*"
          onChange={handleManualFileUpload}
          ref={hiddenFileInput}
          style={{ display: "none" }}
        />
      </div>
      <div className="mt-5">
        {(compositionVideoData && compositionVideoData.song) && (
          <>
            <IoMusicalNotes color="green" /> 이 연주의 곡 정보
            <b>
              <p style={{ fontSize: "0.8em", marginTop: "5px" }}>
                {compositionVideoData.song.artist}&nbsp; -&nbsp;{" "}
                {compositionVideoData.song.name}
              </p>
            </b>
          </>
        )}
      </div>
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

      {/*
      <Button className="mt-3"> + 이 곡에 맞는 연주 추가하기</Button>
        <div>모든 영상에 대한 싱크 조정 구현 후 구현 예정입니다.</div>*/}
    </S.Wrap>
  );
}

/* VideoComponent와 중복. */
const S = {
  Grid: styled.div`
    width: 1920px;
    height: 1080px;
    grid-template-columns: 0fr 1fr 1fr 2fr;
    grid-template-rows: 0fr 0.1fr 0.1fr 1fr;
    display: grid;
    row-gap: 2%;
    column-gap: 1%;
    align-items: center;
  `,

  Background: styled.div`
    z-index: 0;
    grid-area: 1 / 1 / span 4 / span 4;
  `,

  TopLeft: styled.div`
    z-index: 1;
    grid-area: 2 / 2 / span 1 / span 1;
  `,

  TopRight: styled.div`
    z-index: 1;
    grid-area: 2 / 3 / span 1 / span 1;
  `,

  BottomLeft: styled.div`
    z-index: 1;
    grid-area: 3 / 2 / span 1 / span 1;
  `,

  BottomRight: styled.div`
    z-index: 1;
    grid-area: 3 / 3 / span 1 / span 1;
  `,

  Wrap: styled.div`
    text-align: center;
    display: flex;
    max-width: 100%;
    flex-direction: column;
    align-items: center;
  `,

  VideoContainer: styled.div`
    position: relative;
    background: black;
    width: 960px;
    height: 540px;
  `,

  Introduction: styled.div`
    font-size: 2em;
    text-align: right;
    padding-right: 10%;

    > img {
      width: 30%;
    }
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
};

export default RecordCompositionComponent;
