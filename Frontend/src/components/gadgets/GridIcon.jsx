import styled from "styled-components";

function GridIcon({ position }) {
  return (
    <S.Grid>
      <S.Background
        style={{ border: position === "BACKGROUND" && "1px solid orange" }}
      />
      <S.TopLeft
        style={{ border: position === "TOP_LEFT" && "1px solid orange" }}
      />
      <S.TopRight
        style={{ border: position === "TOP_RIGHT" && "1px solid orange" }}
      />
      <S.BottomLeft
        style={{ border: position === "BOTTOM_LEFT" && "1px solid orange" }}
      />
      <S.BottomRight
        style={{ border: position === "BOTTOM_RIGHT" && "1px solid orange" }}
      />
    </S.Grid>
  );
}

const S = {
  Grid: styled.div`
    opacity: 0.7;
    min-width: 64px;
    min-height: 45px;
    grid-template-columns: 0.2fr 1fr 1fr 1.5fr;
    grid-template-rows: 0.5fr 1fr 1fr 0.5fr;
    display: grid;
    row-gap: 2%;
    column-gap: 1%;
    align-items: center;

    > * {
      border: 1px solid #d7d7d7;
      border-radius: 4px;
      min-width: 100%;
      min-height: 100%;
    }
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

export default GridIcon;
