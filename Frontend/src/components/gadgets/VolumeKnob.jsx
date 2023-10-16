import React, {memo} from "react";
import "./VolumeKnob.css";
import styled from "styled-components";

class Knob extends React.Component {
  constructor(props) {
    super(props);
    this.fullAngle = props.degrees;
    this.startAngle = (360 - props.degrees) / 2;
    this.endAngle = this.startAngle + props.degrees;
    this.margin = props.size * 0.15;
    this.currentDeg = Math.floor(
      this.convertRange(
        props.min,
        props.max,
        this.startAngle,
        this.endAngle,
        props.value
      )
    );
    this.state = { deg: this.currentDeg };
  }

  startDrag = (e) => {
    e.preventDefault();
    const knob = e.target.getBoundingClientRect();
    const pts = {
      x: knob.left + knob.width / 2,
      y: knob.top + knob.height / 2,
    };
    const moveHandler = (e) => {
      this.currentDeg = this.getDeg(e.clientX, e.clientY, pts);
      if (this.currentDeg === this.startAngle) this.currentDeg--;
      let newValue = Math.floor(
        this.convertRange(
          this.startAngle,
          this.endAngle,
          this.props.min,
          this.props.max,
          this.currentDeg
        )
      );
      this.setState({ deg: this.currentDeg });
      this.props.onChange(newValue);
    };
    document.addEventListener("mousemove", moveHandler);
    document.addEventListener("mouseup", (e) => {
      document.removeEventListener("mousemove", moveHandler);
    });
  };

  getDeg = (cX, cY, pts) => {
    const x = cX - pts.x;
    const y = cY - pts.y;
    let deg = (Math.atan(y / x) * 180) / Math.PI;
    if ((x < 0 && y >= 0) || (x < 0 && y < 0)) {
      deg += 90;
    } else {
      deg += 270;
    }
    let finalDeg = Math.min(Math.max(this.startAngle, deg), this.endAngle);
    return finalDeg;
  };

  convertRange = (oldMin, oldMax, newMin, newMax, oldValue) => {
    return (
      ((oldValue - oldMin) * (newMax - newMin)) / (oldMax - oldMin) + newMin
    );
  };

  renderTicks = () => {
    let ticks = [];
    const incr = this.fullAngle / this.props.numTicks;
    const size = this.margin + this.props.size / 2;
    for (let deg = this.startAngle; deg <= this.endAngle; deg += incr) {
      const tick = {
        deg: deg,
        tickStyle: {
          height: size + 10,
          left: size - 1,
          top: size + 2,
          transform: "rotate(" + deg + "deg)",
          transformOrigin: "top",
        },
      };
      ticks.push(tick);
    }
    return ticks;
  };

  dcpy = (o) => {
    return JSON.parse(JSON.stringify(o));
  };

  render() {
    let kStyle = {
      width: this.props.size,
      height: this.props.size,
    };
    let iStyle = this.dcpy(kStyle);
    let oStyle = this.dcpy(kStyle);
    oStyle.margin = this.margin * 1.1;
    if (this.props.color) {
      oStyle.backgroundImage =
        "radial-gradient(100% 70%,hsl(32, " +
        this.currentDeg +
        "%, " +
        this.currentDeg / 5 +
        "%),hsl(" +
        Math.random() * 100 +
        ",20%," +
        this.currentDeg / 36 +
        "%))";
    }
    iStyle.transform = "rotate(" + this.state.deg + "deg)";

    return (
      <div className="knob" style={kStyle}>
        <div className="ticks">
          {this.props.numTicks
            ? this.renderTicks().map((tick, i) => (
                <div
                  key={i}
                  className={
                    "tick" + (tick.deg <= this.currentDeg ? " active" : "")
                  }
                  style={tick.tickStyle}
                />
              ))
            : null}
        </div>
        <div className="knob outer" style={oStyle} onMouseDown={this.startDrag}>
          <div className="knob inner" style={iStyle}>
            <div className="grip" />
          </div>
        </div>
      </div>
    );
  }
}
Knob.defaultProps = {
  size: 50,
  min: 1,
  max: 100,
  numTicks: 25,
  degrees: 260,
  value: 100,
  color: false,
};

function VolumeKnob(props) {
const D = 60;

  return (
    <>
      {props.recordingComposition ? (
        <div>
          <p>원하는 위치의 다이얼을 움직여, 영상별로 볼륨을 조절합니다.</p>
          <S.VolumeGrid>
            <S.Background>
              <Knob
                value={props.sessionVolumes["BACKGROUND"]}
                onChange={(e) => {
                  props.handleVolumeChange(e, "BACKGROUND");
                }}
              />
            </S.Background>

            <S.TopLeft>
              {props.sessionsMap.has("TOP_LEFT") && (
                <Knob
                  value={props.sessionVolumes["TOP_LEFT"]}
                  onChange={(e) => {
                    props.handleVolumeChange(e, "TOP_LEFT");
                  }}
                />
              )}
            </S.TopLeft>

            <S.TopRight>
              {props.sessionsMap.has("TOP_RIGHT") && (
                <Knob
                  value={props.sessionVolumes["TOP_RIGHT"]}
                  onChange={(e) => {
                    props.handleVolumeChange(e, "TOP_RIGHT");
                  }}
                />
              )}
            </S.TopRight>
            <S.BottomLeft>
              {props.sessionsMap.has("BOTTOM_LEFT") && (
                <Knob
                  value={props.sessionVolumes["BOTTOM_LEFT"]}
                  onChange={(e) => {
                    props.handleVolumeChange(e, "BOTTOM_LEFT");
                  }}
                />
              )}
            </S.BottomLeft>
            <S.BottomRight>
              {props.sessionsMap.has("BOTTOM_RIGHT") && (
                <Knob
                  value={props.sessionVolumes["BOTTOM_RIGHT"]}
                  onChange={(e) => {
                    props.handleVolumeChange(e, "BOTTOM_RIGHT");
                  }}
                />
              )}
            </S.BottomRight>
          </S.VolumeGrid>
        </div>
      ) : (
        <S.VolumeSingleBlock>
          <Knob
            onChange={(e) => {
              props.handleVolumeChange(e, "BACKGROUND");
            }}
          />
        </S.VolumeSingleBlock>
      )}
    </>
  );
}

const S = {
  VolumeSingleBlock: styled.div`
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
  `,
  VolumeGrid: styled.div`
    border: 1px solid #444;
    border-radius: 10px;
    grid-template-columns: 0.2fr 2fr 2fr 3fr;
    grid-template-rows: 0.2fr 2fr 2fr 0.2fr;
    display: grid;
    column-gap: 1%;
    justify-items: center;
    align-items: center;
    width: 480px;
    height: 270px;

    > div {
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid #444;
      border-radius: 10px;
      width: 100%;
      min-height: 100px;

      &:first-child {
        border: none;
      }
    }
  `,

  Background: styled.div`
    z-index: 1;
    grid-area: 2 / 4 / span 2 / span 2;
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

export default memo(VolumeKnob);
