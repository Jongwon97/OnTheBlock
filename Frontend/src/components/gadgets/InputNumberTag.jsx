import styled from "styled-components";


function InputNumberTag({ value, onChange, onKeyDown }) {
  return (
    <S.Tag
      type="number"
      value={value}
      onChange={(e) => onChange(e)}
      onKeyDown={(e) => onKeyDown(e)}
    />
  );
}

const S = {
  Tag: styled.input`
    border: solid 1.5px rgba(200, 120, 0, 0.8);
    -webkit-appearance: none;
    -ms-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background: #212121;
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
      border: solid 1.5px orange;
      -webkit-transition: 0.5s;
      transition: 0.5s;
    }
  `,
};

export default InputNumberTag;
