import styled from "styled-components";

function SquareSlider({ min, max, value, onChange }) {
  return (
    <>
      <S.Slider
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={onChange}
      />
    </>
  );
}

const S = {
  Slider: styled.input`
    z-index: 3;
    -webkit-appearance: none;
    width: 100%;
    position: relative;
    background: orange;
    outline: none;
    opacity: 0.7;
    -webkit-transition: 0.2s;
    transition: opacity 0.2s;
    border-radius: 4px;

    &:hover {
      opacity: 1;
    }

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 16px;
      height: 16px;
      border-radius: 4px;
      background: #ffffff;
      cursor: pointer;
    }
    &::-moz-range-thumb {
      width: 16px;
      height: 16px;
      border-radius: 4px;
      background: #ffffff;
      cursor: pointer;
    }
  `,
};

export default SquareSlider;