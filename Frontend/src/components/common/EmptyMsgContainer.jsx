
import styled from "styled-components";
import Logo from "@/assets/logo_white.png";

function EmptyMsgContainer({ emptyMsg, height }) {
    return (
      <S.EmptyMsgContainer style={{height: height}}>
        <S.Logo src={Logo} />
        <S.EmptyMsgDefault>- 조회된 영상 데이터가 없습니다 -</S.EmptyMsgDefault>
        <S.EmptyMsgDynamic>
          {emptyMsg && <div>{emptyMsg}</div>}
        </S.EmptyMsgDynamic>
      </S.EmptyMsgContainer>
    );
}

const S = {
  EmptyMsgContainer: styled.div`
    display: flex;
    border: 1px solid #444;
    border-radius: 10px;
    flex-direction: column;
    width: 100%;
    align-items: center;
    justify-content: center;
  `,

  Logo: styled.img`
    width: 140px;
    opacity: 0.3;
    margin-bottom: 10px;
  `,

  EmptyMsgDefault: styled.div`
    color: #d7d7d7;
    opacity: 0.3;
  `,

  EmptyMsgDynamic: styled.div`
    font-size: 0.8em;
    color: #d7d7d7;
    opacity: 0.8;
  `,
};

export default EmptyMsgContainer;