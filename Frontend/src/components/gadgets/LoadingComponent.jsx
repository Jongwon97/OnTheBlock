import styled from "styled-components";
import { Button, Spinner } from "react-bootstrap";
import { useState, useRef, useEffect } from "react";

function LoadingComponent() {
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setOpacity((prevOpacity) => (prevOpacity === 1 ? 0.5 : 1));
    }, 500);

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);
  
  return (
    <>
      <Spinner size="48" />
      <S.BlinkText style={{ opacity: opacity }}>
        <b>파일 업로드 중...</b>
      </S.BlinkText>
      <S.SubText>화면을 끄지 마세요.</S.SubText>
      <S.SubText>파일 크기에 따라 1~3분 정도 소요됩니다.</S.SubText>
      <div></div>
    </>
  );
}

const S = {
  BlinkText: styled.div`
    transition: opacity 0.5s ease-in-out;
  `,

  SubText: styled.div`
    color: #aaa;
    font-size: 0.8em;
  `,
};


export default LoadingComponent;