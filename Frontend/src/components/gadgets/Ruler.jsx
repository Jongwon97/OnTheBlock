import styled from "styled-components";

function Ruler() {
  return (
      <S.Ruler>
        {[...Array(6)].map((_, index) => (
          <S.RulerScale key={index}>
            {[...Array(11)].map((_, innerIndex) => (
              <div key={innerIndex}></div>
            ))}
          </S.RulerScale>
        ))}

      </S.Ruler>
  );
}

const S = {
  Ruler: styled.div`
    display: grid;
    min-height: 50px;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  `,

  RulerScale: styled.div`
    max-width: 100%;
    max-height: 10px;
    border-right: 2px solid black;
    display: flex;
    justify-content: space-between;

    &:last-child {
      border-right: none;
    }

    > div {
      max-height: 5px;
      border-right: 0.5px solid black;

      &:first-child {
        border-right: none;
      }
      &:nth-child(6) {
        border-right: 1px solid black;
      }
      &:last-child {
        border-right: none;
      }
    }
  `,

  SlideContainer: styled.div`
    height: 75px;
    background: #ffffff;
  `,

  SliderBlock: styled.div`
    z-index: 0;
    background: black;
  `,
};

export default Ruler;
