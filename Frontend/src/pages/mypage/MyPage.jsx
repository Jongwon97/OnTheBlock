import React from 'react'
import { Outlet } from 'react-router-dom'
import styled from "styled-components"
import { MyPageSidebar } from "@/components"
import { MyPageGridContent } from "@/components"


function MyPage() {

  return (
    <S.Wrap>
      <S.Container>
        <S.MyPageSidebarContainer>
          <MyPageSidebar/>
        </S.MyPageSidebarContainer>

        <S.MyPageContentContainer>
          <Outlet/>
        </S.MyPageContentContainer>
      </S.Container>
    </S.Wrap>
  );
}

const S = {
  Wrap: styled.div`
    background: #252525;
    padding: 0px;
    color: #d7d7d7;
  `,

  Container: styled.div`
    display: flex;
  `,

  MyPageSidebarContainer: styled.div`
    min-width: 240px;
    width: 240px;
    height: 100%;
    position: sticky;
    top: 0px;
  `,

  MyPageContentContainer: styled.div`
    width: -webkit-calc(100% - 240px);
    width:    -moz-calc(100% - 240px);
    width:         calc(100% - 240px);
  `,
};
  
  export default MyPage;
  