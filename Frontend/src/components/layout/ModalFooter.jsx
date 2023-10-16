import React from "react";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Logo from "@/assets/logo_white.png";

function ModalFooter() {
    return (
      <S.ModalFooter>
        <S.Logo src={Logo}/>
      </S.ModalFooter>
    );
}

const S = {
  Modal: styled(Modal)`
    text-align: center;
  `,

  Logo: styled.img`
    width: 120px;
  `,

  ModalFooter: styled(Modal.Footer)`
    display: flex;
    justify-content: center;
    text-align: center;
  `,
};

export default ModalFooter;