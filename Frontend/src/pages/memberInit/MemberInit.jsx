import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAllInstruments, registMemberInstruments } from '../../api/instrument';
import { getAllGenres, registMemberGenres } from '../../api/genre';
import styled from 'styled-components';
import { SelectButton } from 'primereact/selectbutton';
import { Button } from 'primereact/button';
import Image from 'react-bootstrap/Image';
import { InputText } from 'primereact/inputtext';
import { checkDuplicateNickname } from '../../api/member';
import { registMemberInit } from '../../api/member';
import InitBanner from "@/assets/banners/init.jpeg";

function MemberInit() {
   const navigate = useNavigate();

   const [nickName, setNickName] = useState('');
   const [nickNameCheck, setNickNameCheck]=useState('');
   const [isNicknameAvailable, setIsNicknameAvailable] = useState(false); 

   const [instruments, setInstruments] = useState([]);
   const [selectedInstruments, setSelectedInstruments] = useState([]);

   const [genres, setGenres] = useState([]);
   const [selectedGenres, setSelectedGenres] = useState([]);

   // 데이터 랜더링
   useEffect(() => {
       getAllInstruments().then((response) => {
           setInstruments(response.data);
       });

       getAllGenres().then((response) => {
           setGenres(response.data);
       });
   }, []);

   // 버튼 관련
   const [loading, setLoading] = useState(false);

   const load = () => {
        registMemberInit(nickName,selectedInstruments,selectedGenres).then((response)=>{
            //console.log(response.data);
        })
       setLoading(true);
       setTimeout(() => {
            setLoading(false);
            navigate('/main', { replace:true });
        },500);
    };

    const checkNickName=()=>{
        if (nickName.length < 2 || nickName.length > 10) {
            alert("닉네임은 최소 2글자 이상, 10글자 이하이어야 합니다.");
            return;
        }
        checkDuplicateNickname(nickName).then((response)=>{
            //console.log(response.data);
            if(response.data==true){
                setNickNameCheck("사용 가능한 닉네임 입니다!");
                setIsNicknameAvailable(true);
            }
            else{
                setNickNameCheck("이미 존재하는 닉네임 입니다.");
                setIsNicknameAvailable(false);
            }
        })
    }

    return (
      <S.Container>
        <S.Title>환영합니다!</S.Title>
        <br />
        {/* style={{ background: `url(${InitBanner})` }} */}
        {/* <Image src="/src/assets/MemberInit_top.jpg" style={{ width: '500px', height: '550px' }} rounded /> */}

        <S.SubTitle>닉네임을 설정해 주세요!</S.SubTitle>
        <div>
          <InputText
            value={nickName}
            onChange={(e) => setNickName(e.target.value)}
          />
          &nbsp;&nbsp;&nbsp;
          <Button
            label="중복 검사"
            severity="secondary"
            onClick={checkNickName}
          />
        </div>
        {nickNameCheck}

        <S.SubTitle>어떤 악기를 연주하고 싶으신가요?</S.SubTitle>
        <SelectButton
          value={selectedInstruments}
          onChange={(e) => setSelectedInstruments(e.value)}
          optionLabel="instrumentName"
          options={instruments}
          multiple
        />
        <br />

        <S.SubTitle>관심있는 장르는 무엇인가요?</S.SubTitle>
        <SelectButton
          value={selectedGenres}
          onChange={(e) => setSelectedGenres(e.value)}
          optionLabel="genreName"
          options={genres}
          multiple
        />
        <br />
        <br />

        <Button
          label="Submit"
          icon="pi pi-check"
          loading={loading}
          onClick={load}
          disabled={!isNicknameAvailable}
        />
      </S.Container>
    );
}


const S = {
  Container: styled.div`
    background-size: contain;
    width: 100%;
    height: auto;
    background-color: black;
    color: orange;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 50px;
  `,

  Title: styled.h1`
    margin-top: 2rem;
    margin-bottom: 20px;
  `,

  SubTitle: styled.h4`
    margin-top: 1rem;
    margin-bottom: 20px;
  `,
};

export default MemberInit;
