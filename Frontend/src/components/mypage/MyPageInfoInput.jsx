import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  changeUserNickName,
  changeUserDescription,
  checkDuplicateNickname,
} from "@/api/member";
import {
  getAllInstruments,
  registMemberInstruments,
  getMyInstruments,
} from "@/api/instrument";
import { getAllGenres, registMemberGenres, getMyGenres } from "@/api/genre";
import styled from "styled-components";
import Button from "react-bootstrap/Button";
import { SelectButton } from "primereact/selectbutton";
import { getMyUserInfo } from "@/api/member";
import { ProfileImg } from "@/components";

function MyPageInfoInput() {
  const navigate = useNavigate();
  // const { newNickName, newDescription } = useParams();

  const MIN_NICKNAME_LENGTH = 2;
  const MAX_NICKNAME_LENGTH = 10;
  const MIN_DESCRIPTION_LENGTH = 1;
  const MAX_DESCRIPTION_LENGTH = 40;

  const [userData, setUserData] = useState(null);
  const [nickName, setNickName] = useState("");
  const [nickNameCheck, setNickNameCheck] = useState("");
  const [isNickNameAvailable, setIsNickNameAvailable] = useState(false);

  const [description, setDescription] = useState("");
  const [descriptionCheck, setDescriptionCheck] = useState("");

  const [instruments, setInstruments] = useState([]);
  const [selectedInstruments, setSelectedInstruments] = useState([]);

  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);

  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const pagePaths = {
    mypageinformation: "/mypage/information",
  };

  useEffect(() => {
    getMyUserInfo().then((response) => {
      setUserData(response.data);
      if (response.data) {
        setNickName(response.data.nickName);
        setDescription(response.data.description);
      }
    });
  }, []);

  const handleDeleteAccount = () => {
    if (isDeletingAccount) {
      // 로직 구현
      setIsDeletingAccount(false);
    } else {
      setIsDeletingAccount(true);
    }
  };

  const checkNickName = () => {
    if (nickName.length < 2 || nickName.length > 10) {
      setNickNameCheck("닉네임은 최소 2글자 이상, 10글자 이하이어야 합니다.");
      return;
    }
    checkDuplicateNickname(nickName).then((response) => {
      if (response.data == true) {
        setNickNameCheck("사용 가능한 닉네임입니다!");
        setIsNickNameAvailable(true);
      } else {
        setNickNameCheck("이미 존재하는 닉네임입니다.");
        setIsNickNameAvailable(false);
      }
    });
  };

  const checkDescription = () => {
    // 자기소개 길이 유효성 검사
    if (description.length < MIN_DESCRIPTION_LENGTH) {
      setDescriptionCheck(
        "자기소개는 " + MIN_DESCRIPTION_LENGTH + "자 이상이어야 합니다."
      );
    } else if (description.length > MAX_DESCRIPTION_LENGTH) {
      setDescriptionCheck(
        "자기소개는 " + MAX_DESCRIPTION_LENGTH + "자 이하여야 합니다."
      );
    } else {
      sendChangeDescription(description);
      setDescriptionCheck("");
    }
  };

  const sendChangeUserNickName = async (newNickName) => {
    try {
      await changeUserNickName(newNickName);
      localStorage.setItem("nickName", newNickName);
      window.location.reload();
    } catch (error) {
    }
  };

  const sendChangeDescription = async (newDescription) => {
    try {
      await changeUserDescription(newDescription);
      window.location.reload();
    } catch (error) {
    }
  };

  const sendChangeInstruments = async (newInstruments) => {
    try {
      await registMemberInstruments(newInstruments);
      window.location.reload();
    } catch (error) {
    }
  };

  const sendChangeGenres = async (newGenres) => {
    try {
      await registMemberGenres(newGenres);
      window.location.reload();
    } catch (error) {
    }
  };

  useEffect(() => {
    getAllInstruments().then((response) => {
      setInstruments(response.data);
    });

    getMyInstruments().then((response) => {
      setSelectedInstruments(response.data);
    });

    getAllGenres().then((response) => {
      setGenres(response.data);
    });

    getMyGenres().then((response) => {
      setSelectedGenres(response.data);
    });
  }, []);

  return (
    <>
      <S.Wrap>
        <S.ProfileImgWrap>
          <ProfileImg nickName={nickName} size="128" />
        </S.ProfileImgWrap>
        <br></br>
        <br></br>
        {/* 닉네임 */}
        닉네임 변경
        <S.InputWrapper>
          <S.Input
            type="text"
            value={nickName}
            onChange={(e) => setNickName(e.target.value)}
            placeholder="새 닉네임을 입력하세요."
          />
          <S.ButtonContainer>
            <Button
              variant="secondary"
              onClick={checkNickName}
              style={{ marginRight: "10px" }}
            >
              중복 검사
            </Button>
            <Button
              variant="warning"
              onClick={() => {
                // 닉네임 길이 유효성 검사
                if (nickName.length < MIN_NICKNAME_LENGTH) {
                  alert(
                    "닉네임은 " + MIN_NICKNAME_LENGTH + "자 이상이어야 합니다."
                  );
                } else if (nickName.length > MAX_NICKNAME_LENGTH) {
                  alert(
                    "닉네임은 " + MAX_NICKNAME_LENGTH + "자 이하여야 합니다."
                  );
                } else if (!isNickNameAvailable) {
                  alert("닉네임 중복을 확인해주세요.");
                } else {
                  sendChangeUserNickName(nickName);
                }
              }}
            >
              수정
            </Button>{" "}
          </S.ButtonContainer>
        </S.InputWrapper>
        {nickNameCheck != "" && <S.MsgBox>{nickNameCheck}</S.MsgBox>}
        <br></br>
        {/* 자기소개 */}
        자기소개 변경
        <S.DescriptionWrapper>
          <S.Textarea
            type="textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="자기소개를 입력하세요."
          />
          <S.NextLineButtonWrapper>
            <div>
              {descriptionCheck != "" && (
                <S.MsgBox>{descriptionCheck}</S.MsgBox>
              )}
            </div>
            <Button variant="warning" onClick={checkDescription}>
              수정
            </Button>
          </S.NextLineButtonWrapper>
        </S.DescriptionWrapper>
        <br></br>
        <br></br>
        {/* 악기 선택 */}
        관심 악기
        <S.SelectionWrapper>
          <SelectButton
            value={selectedInstruments}
            onChange={(e) => setSelectedInstruments(e.value)}
            optionLabel="instrumentName"
            options={instruments}
            multiple
          />

          <S.NextLineButtonWrapper>
            <div></div>
            <Button
              variant="warning"
              style={{ marginTop : "5px" }}
              onClick={() => {
                sendChangeInstruments(selectedInstruments);
              }}
            >
              수정
            </Button>{" "}
          </S.NextLineButtonWrapper>
        </S.SelectionWrapper>
        <br></br>
        <br></br>
        {/* 장르 선택 */}
        관심 장르
        <S.SelectionWrapper>
          <SelectButton
            value={selectedGenres}
            onChange={(e) => setSelectedGenres(e.value)}
            optionLabel="genreName"
            options={genres}
            multiple
          />

          <S.NextLineButtonWrapper>
              <div></div>
              <Button
                variant="warning"
                style={{ marginTop : "5px" }}
                onClick={() => {
                    sendChangeGenres(selectedGenres);
                  }}
                >
                  수정
              </Button>{" "}
          </S.NextLineButtonWrapper>
        </S.SelectionWrapper>
        <br></br>
        <br></br>
        <div>
          {isDeletingAccount && (
            <>
              <div>
                삭제된 정보는 복구할 수 없습니다. 정말 회원탈퇴를
                진행하시겠습니까?
                <p>사항을 확인했고 OnTheBlock에서 내 계정을 삭제합니다.</p>
                회원탈퇴
              </div>
            </>
          )}
        </div>
        <Button style={{ width: 100 }} onClick={handleDeleteAccount}>
          회원 탈퇴
        </Button>
        {isDeletingAccount && <Button style={{ width: 100 }}>취소</Button>}
      </S.Wrap>
    </>
  );
}

const S = {
  Textarea: styled.textarea`
    border: solid 1.5px #212121;
    -webkit-appearance: none;
    -ms-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background: #303030;
    border-radius: 5px;
    outline: none;
    font-size: 14px;
    height: 120px;
    width: 100%;
    align: top !important;
    justify-content: start;
    align-item: start;
    padding: 5px;
    color: #f2f2f2;

    &:hover {
      border: solid 1.5px #d2691e;
      -webkit-transition: 0.5s;
      transition: 0.5s;
    }

    &::placeholder {
      font-size: 0.9em;
      color: #f2f2f2;
    }
  `,

  Input: styled.input`
    border: solid 1.5px #212121;
    -webkit-appearance: none;
    -ms-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background: #303030;
    padding: var(--field-padding);
    border-radius: 5px;
    outline: none;
    font-size: 14px;
    padding: 5px;
    width: 250px;
    color: #f2f2f2;

    &:hover {
      border: solid 1.5px #d2691e;
      -webkit-transition: 0.5s;
      transition: 0.5s;
    }

    &::placeholder {
      font-size: 0.9em;
      color: #f2f2f2;
    }
  `,

  Wrap: styled.div`
    display: flex;
    flex-direction: column;
    justify-contnet: center;
    align-items: left;
    padding: 80px;
  `,

  CardBody: styled.div`
    background: #252525;
    z-index: 300;
    color: white;

    display: flex;
    justify-content: center;

    flex-direction: column;
    align-items: center;
    padding-top: 20px;
    padding-bottom: 20px;

    border-top: 2px solid #fff;
    border-bottom: 2px solid #fff;
  `,

  DarkOverlay: styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
  `,

  Description: styled.p`
    color: orange;
    font-size: 20px;
    font-weight: bold;
    margin-top: 20px;
  `,

  InputWrapper: styled.div`
    margin-top: 3px;
    display: flex;
    justify-content: left;
    width: 480px;
  `,

  NextLineButtonWrapper: styled.div`
  display: flex;

    width: 100%;
  justify-content: space-between;
  `,

  DescriptionWrapper: styled.div`
    margin-top: 3px;
    justify-content: left;
    width: 480px;
  `,

  SelectionWrapper: styled.div`
    width: 800px;
  `,

  ButtonContainer: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 10px;
  `,

  ProfileImgWrap: styled.div`
    position: relative;
    cursor: pointer;
    color: #d7d7d7;
  `,

  MsgBox: styled.div`
    color: #60262c;
    min-width: 240px;
    width: fit-content;
    border-radius: 2px;
    margin-top: 5px;
    padding: 5px;
    font-size: 0.8em;
    outline: 1.5px solid #a14c64;
    outline-offset: -3px;
    background-color: #ffb0aa;
    opacity: 1;
    transition: 0.3s opacity;
  `,
};

export default MyPageInfoInput;
