import { Form, Col, Row } from "react-bootstrap";
import styled from "styled-components";
import { useState, useEffect } from "react";
import _ from "lodash";
import FilmStrip from "@/assets/filmstrip.png";
import { SquareSlider, Ruler, GridIcon, InputNumberTag } from "@/components";

function SyncSlider({ position, startPoint, setStartPoint, totalFrame, max }) {
  const [tagValue, setTagValue] = useState(startPoint);

  const handleRangeChange = (e) => {
    setTagValue(Number(e.target.value));
    setStartPoint(Number(e.target.value));
  };

  //마우스 떼면 바뀌게 어떻게 하냐
  const handleRangeMouseUp = (e) => {
    setStartPoint(tagValue);
  };

  const handleNumberKeyDown = (e) => {
    if (e.keyCode == 37) {
      setTagValue(tagValue - 1);
    } else if (e.keyCode == 39) {
      setTagValue(tagValue + 1);
    }
    setStartPoint(tagValue);
  };
  const setVideoStartPoint = _.debounce(() => {
    setStartPoint(tagValue);
  }, 300);

  return (
    <S.Wrap>
      <div style={{ paddingTop: "1.2em" }}>
        <GridIcon position={position} />
        <InputNumberTag
          value={tagValue}
          onChange={(e) => handleRangeChange(e)}
          onKeyDown={(e) => handleNumberKeyDown(e)}
        />
      </div>
      <div style={{ width: "300px" }}>
        <div
          style={{
            display: "flex",
            fontSize: "0.8em",
            justifyContent: "space-between",
          }}
        >
          <div>{-max}</div>
          <div>0</div>
          <div>{max}</div>
        </div>

        <S.FilmSliderContainer>
          <Ruler
            width={"100%"}
            style={{
              minHeight: "50px",
            }}
          ></Ruler>
          <div
            style={{
              position: "absolute",
              left: "50%",
              zIndex: "400",
              top: "0px",
              height: "100px",
              border: "1px solid orange",
            }}
          ></div>
          <S.SliderShade />

          {/* videostrip 길이 프레임수에 맞게 조정할 것. */}
          <S.VideoStrip
            style={{
              borderRadius: "5px",
              display: "flex",
              overflow: "hidden",
              width: `${(totalFrame / max) * 50}%`,
              left: `${((max + tagValue) * 100) / (2 * max)}%`,
            }}
          >
            <img
              src={FilmStrip}
              width={`240px`}
              draggable="false"
              style={{ position: "relative" }}
            />
            <img
              src={FilmStrip}
              width={`240px`}
              draggable="false"
              style={{ position: "relative" }}
            />
            <div
              style={{
                display: "flex",
                position: "absolute",
                background: "#d7d7d7",
                borderLeft: "5px solid black",
                borderRight: "5px solid black",
                width: "100%",
                top: "22%",
                height: "58%",
              }}
            >
              <div
                style={{
                  width: "33%",
                  borderRight: "3px solid black",
                }}
              ></div>
              <div
                style={{
                  width: "38%",
                  borderRight: "3px solid black",
                }}
              ></div>
              <div></div>
            </div>
          </S.VideoStrip>
        </S.FilmSliderContainer>
        <SquareSlider
          type="range"
          min={-max}
          max={max - 1}
          value={tagValue}
          defaultValue={startPoint}
          onChange={(e) => handleRangeChange(e)}
        />
      </div>
    </S.Wrap>
  );
}

const S = {
  Wrap: styled.div`
    display: flex;
    gap: 8px;
    align-items: center;
  `,

  Tag: styled.input`
    border: solid 1.5px #212121;
    -webkit-appearance: none;
    -ms-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background: #303030;
    border-radius: 5px;
    outline: none;
    font-size: 14px;
    width: 64px;
    height: 16px;
    text-align: right;
    justify-content: start;
    align-item: start;
    padding: 8px;
    color: #f2f2f2;

    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    /*FireFox환경에서 확인바람.*/
    &:hover {
      border: solid 1.5px #d2691e;
      -webkit-transition: 0.5s;
      transition: 0.5s;
    }
  `,

  VideoStrip: styled.div`
    height: 90%;
    top: 5%;
    position: absolute;
    border: 2px solid #666;
    
                border-right: 5px solid #666;
                border-left: 5px solid #666;
    background: #d7d7d7;
    z-index: 200;

    > img {
      height: 100%;
      pointer-events: none;
  user-drag: none; 
  user-select: none;
  -moz-user-select: none;
  -webkit-user-drag: none;
  -webkit-user-select: none;
  -ms-user-select: none;
    }
  `,

  FilmSliderContainer: styled.div`
    border-radius: 4px;
    overflow: hidden;
    background: gray;
    position: relative;
  `,

  SliderShade: styled.div`
    position: absolute;
    z-index: 0;
    background: black;
    display: flex;
    top: 0px;
    height: 100%;
    opacity: 0.5;
    z-index: 300;
    min-width: 50%;
  `,
};

export default SyncSlider;
