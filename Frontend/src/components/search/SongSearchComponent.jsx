import React, { useRef } from 'react';
import styled from 'styled-components';

const SongSearchComponent = React.forwardRef(({ handleInputKeyDown, handleSearchClick }, ref) => {

    return (
      <S.SearchContainer>
        <S.SearchInput 
          ref={ref} 
          onKeyDown={handleInputKeyDown} 
          placeholder="곡 이름으로 검색" />
        <S.SearchButton onClick={handleSearchClick}>
          Search
        </S.SearchButton>
      </S.SearchContainer>
    );
  });
  
SongSearchComponent.displayName = 'SongSearchComponent';

const S = {
  SearchContainer: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
  `,
  
  SearchInput: styled.input`
    padding: 8px;
    width: 200px;
    border-radius: 4px;
    border: none;
    
   &:focus {
     outline:none;   
   }
 `,

 SearchButton : styled.button`
   padding :8px; 
   background-color:#a66959; 
   color:white; 
   border:none; 
   cursor:pointer; 

    &:hover{
        background-color:#814b3e;  
    }
 `,
};

export default SongSearchComponent;

