import React from "react";
import styled from "styled-components";
import { FaSearch } from "react-icons/fa";

const SearchBarComponent = React.forwardRef((props, ref) => (
  <>
    <S.SearchBarContainer>
      <S.SearchQueryInput
        ref={ref}
        type="text"
        placeholder={props.placeholder}
        onKeyDown={(e) => props.handleInputKeyDown(e)}
      />
      <S.SearchQuerySubmit type="submit" onClick={props.handleSearchClick}>
        <FaSearch size="18" />
      </S.SearchQuerySubmit>
    </S.SearchBarContainer>
  </>
));

const S = {
  SearchBarContainer: styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  `,

  SearchQueryInput: styled.input`
    width: 100%;
    height: 2.5rem;
    background: rgba(0, 0, 0, 0);
    color: white;
    outline: none;
    border: 4px solid white;
    border-radius: 1.625rem;
    padding: 0 3.5rem 0 1rem;
    font-size: 1rem;

    &::-webkit-input-placeholder {
      font-size: 1em;
      color: white;
      opacity: 0.8;
    }
    &:-ms-input-placeholder {
      font-size: 1em;
      color: white;
      opacity: 0.8;
    }
  `,

  SearchQuerySubmit: styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3.5rem;
    height: 2.8rem;
    color: white;
    margin-left: -3.5rem;
    background: none;
    border: none;
    outline: none;
    cursor: pointer;
  `,
};

export default SearchBarComponent;
