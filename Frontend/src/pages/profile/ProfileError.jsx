import { useNavigate } from "react-router-dom";
import styled from "styled-components";

function ProfileError() {
    const navigate = useNavigate();
  
    return (
      <S.Wrap>
        <S.Container>
          <S.ErrorMessage>유효하지 않은 프로필입니다.</S.ErrorMessage>
          <br />
          <S.GoBackButton onClick={() => navigate('/main')}>홈으로</S.GoBackButton>
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
    flex-direction: column;
    width: 98vw;
    height: 100vh;
    justify-content: center;
    align-items: center;
  `,

  ErrorMessage: styled.h1`
     color:orange; 
     margin-bottom :20px;
     font-weight: bold;
   `,

   GoBackButton : styled.button` 
     padding :10px; 
     background-color :#ffffff; 
     border-radius :5px; 
     cursor:pointer; 

     &:hover { 
       background-color:#ddd;  
      }   
   `
};
  
export default ProfileError;

