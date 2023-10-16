import { AbsoluteFill, IFrame, Audio, Video, staticFile } from "remotion";
import { useState } from "react";
//https://www.pexels.com/ko-kr/download/video/3692634/
//https://project-dokkaebi.s3.ap-northeast-2.amazonaws.com/images/default/%EC%98%81%EC%83%81/pexels_videos_1536322+(1080p).mp4

//to-do : left, top 값 일치시킬 것.

function Clips() {
  
  const [inFrame, setInframe] = useState(0);

  const urlArray = [
    "https://www.pexels.com/ko-kr/download/video/3692634/",
    "https://www.pexels.com/ko-kr/download/video/3692634/",
    "https://www.pexels.com/ko-kr/download/video/3692634/"
  ]

  return (
    <>
      <AbsoluteFill style={{ position: "relative" }}>
        <Video
          style={{ position: "absolute", left: "5%", top: "10%" }}
          src={urlArray[1]}
          width="30%"
        />
        <Video
          style={{ position: "absolute", left: "5%", bottom: "10%" }}
          src={urlArray[2]}
          width="30%"
        />
        <Video src={urlArray[0]} width="100%" />
      </AbsoluteFill>
    </>
  );
};

export default Clips; 