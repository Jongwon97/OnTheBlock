import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { RecordCompositionComponent, SessionSearchComponent } from "@/components";

function CompositionRecord() {
  const navigate = useNavigate();

  return (
    <S.Wrap>
      <RecordCompositionComponent />
    </S.Wrap>
  );
}

const S = {
  Wrap: styled.div`
    min-height: 100vh;
    background: #252525;
    padding-top: 4em;
    padding-bottom: 4em;
    color: #d7d7d7;
  `,
};

export default CompositionRecord;
