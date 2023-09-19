import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { RecordSessionComponent } from "@/components";

function SessionRecord() {
  const navigate = useNavigate();

  return (
    <S.Wrap>
      <RecordSessionComponent />
    </S.Wrap>
  );
}

const S = {
  Wrap: styled.div`
    min-height: 100vh;
    background: #252525;
    padding: 0px;
    color: #d7d7d7;
  `,
};

export default SessionRecord;
