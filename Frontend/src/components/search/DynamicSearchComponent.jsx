import { React, useState } from "react";
import styled from "styled-components";

const data = [
  //의미 없는 더미 데이터
  {
    id: 1,
    text: "Devpulse",
  },
  {
    id: 2,
    text: "Linklinks",
  },
  {
    id: 3,
    text: "Centizu",
  },
  {
    id: 4,
    text: "Dynabox",
  },
  {
    id: 5,
    text: "Avaveo",
  },
  {
    id: 6,
    text: "Demivee",
  },
  {
    id: 7,
    text: "Jayo",
  },
  {
    id: 8,
    text: "Blognation",
  },
  {
    id: 9,
    text: "Podcat",
  },
  {
    id: 10,
    text: "Layo",
  },
]; 

function SongSearchComponent(props) {
  //create a new array by filtering the original array

  const filteredData = data.filter((el) => {
    //if no input the return the original
    if (props.input === "") {
      return el;
    }
    //return the item which contains the user input
    else {
      return el.text.toLowerCase().includes(props.input);
    }
  });
  return (
    <S.List>
      {filteredData.map((item) => (
        <li key={item.id}>{item.text}</li>
        // 클릭 시 상위 컴포넌트에 데이터 변경 트리거.
      ))}
    </S.List>
  );
}

const S = {
  List: styled.ul`
    overflow: scroll;
    height: 100px;

    ::-webkit-scrollbar-thumb {
      background-color: #007bff; /* Color of the thumb */
      border-radius: 6px; /* Rounded corners for the thumb */
    }
  `,
};

export default SongSearchComponent;
