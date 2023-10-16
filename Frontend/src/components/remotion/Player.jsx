import { Player } from "@remotion/player";
import Clips from "@/components/remotion/Clips.jsx";

/*
To-Do : 
- 클립별 프레임 조정으로 싱크 맞추기
- InFrame 또는 OutFrame으로 전체 비디오 자르기
- 위치 Swap.
*/
function Composition() {

  return (
    <>
      <Player
        component={Clips}
        durationInFrames={120}
        compositionWidth={1920}
        compositionHeight={1080}
        fps={30}
        controls
        style={{
          width: 800,
          height: 600,
        }}
      />
      <input type="number"/>
    </>
  );
};

export default Composition;
