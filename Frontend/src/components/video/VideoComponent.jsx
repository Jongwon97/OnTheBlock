import { Player } from "@remotion/player";
import { Img, Video, AbsoluteFill, Sequence } from "remotion";
import { useCallback } from "react";
import LazyLoad from "react-lazyload";
import * as hooks from "@/hooks";
import { useEffect, memo } from "react";
import styled from "styled-components";

function VideoComponent({ maximumFrame }) {
  const { sessionsMap } = hooks.openVideoState();
  const { setSessionsMap } = hooks.openVideoState();

  const renderLoading = useCallback(() => {
    return <AbsoluteFill>Loading...</AbsoluteFill>;
  }, []);

  const VideoElements = () => {
    return (
      <LazyLoad>
        <AbsoluteFill>
          <S.Grid>
            <S.Background>
              {sessionsMap.has("BACKGROUND") ? (
                <Sequence
                  from={Math.max(sessionsMap.get("BACKGROUND").startPoint, 0)}
                  layout="none"
                >
                  <Video
                    src={sessionsMap.get("BACKGROUND").sessionUrl}
                    startFrom={Math.max(
                      -sessionsMap.get("BACKGROUND").startPoint,
                      0
                    )}
                    volume={sessionsMap.get("BACKGROUND").volume / 100}
                    style={{ width: "100%" }}
                  />
                </Sequence>
              ) : (
                <></>
              )}
            </S.Background>
            <S.TopLeft>
              {sessionsMap.has("TOP_LEFT") && (
                <Sequence
                  from={Math.max(sessionsMap.get("TOP_LEFT").startPoint, 0)}
                  layout="none"
                >
                  <Video
                    src={sessionsMap.get("TOP_LEFT").sessionUrl}
                    startFrom={Math.max(
                      -sessionsMap.get("TOP_LEFT").startPoint,
                      0
                    )}
                    volume={sessionsMap.get("TOP_LEFT").volume / 100}
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
                  from={Math.max(sessionsMap.get("BOTTOM_LEFT").startPoint, 0)}
                  layout="none"
                >
                  <Video
                    src={sessionsMap.get("BOTTOM_LEFT").sessionUrl}
                    startFrom={Math.max(
                      -sessionsMap.get("BOTTOM_LEFT").startPoint,
                      0
                    )}
                    volume={sessionsMap.get("BOTTOM_LEFT").volume / 100}
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
                  from={Math.max(sessionsMap.get("TOP_RIGHT").startPoint, 0)}
                  layout="none"
                >
                  <Video
                    src={sessionsMap.get("TOP_RIGHT").sessionUrl}
                    startFrom={Math.max(
                      -sessionsMap.get("TOP_RIGHT").startPoint,
                      0
                    )}
                    volume={sessionsMap.get("TOP_RIGHT").volume / 100}
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
                  from={Math.max(sessionsMap.get("BOTTOM_RIGHT").startPoint, 0)}
                  layout="none"
                >
                  <Video
                    src={sessionsMap.get("BOTTOM_RIGHT").sessionUrl}
                    startFrom={Math.max(
                      -sessionsMap.get("BOTTOM_RIGHT").startPoint,
                      0
                    )}
                    volume={sessionsMap.get("BOTTOM_RIGHT").volume / 100}
                    style={{
                      width: "100%",
                    }}
                  />
                </Sequence>
              )}
            </S.BottomRight>
          </S.Grid>
        </AbsoluteFill>
      </LazyLoad>
    );
  };

  return (
    <>
      <Player
        controls
        component={VideoElements}
        durationInFrames={!maximumFrame ? 9000 : maximumFrame}
        compositionWidth={1920}
        compositionHeight={1080}
        fps={30}
        style={{ width: "100%" }}
        renderLoading={renderLoading}
      />
    </>
  );
}

/* RecordCompositionComponent와 중복. */
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
};

export default memo(VideoComponent);
