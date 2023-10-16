import styled from "styled-components";
import { useState, useRef, useEffect } from "react";
import { InputGroup, Form, Modal, Button, Dropdown } from "react-bootstrap";
//import SongSearchComponent from "@/components/search/SongSearchComponent";
import { useNavigate } from "react-router-dom";
import * as instrumentApi from "@/api/instrument.js";
import * as sessionApi from "@/api/session.js";
import {
  SongSearchComponent,
  ModalFooter,
  LoadingComponent,
  HorizontalDropdown,
} from "@/components";
import { getSongByName } from "@/api/song";
import * as hooks from "@/hooks";
import { InputText, InputTextArea } from "@/components/gadgets/form/InputText";
import Spotify from "@/assets/spotify.png";
import { IoMusicalNotes } from "react-icons/io5";

function UploadRecordInfoModal({ isModalOpen, setIsModalOpen }) {
  const navigate = useNavigate();
  const { data } = hooks.recordVideoState();
  const { videoBlobUrl } = hooks.recordVideoState();
  const { setData } = hooks.recordVideoState();
  const { setVideoBlobUrl } = hooks.recordVideoState();
  const { thumbnailBlobUrl } = hooks.recordVideoState();
  const { session } = hooks.recordVideoState();
  const { setSession } = hooks.recordVideoState();
  const { origins } = hooks.recordVideoState();

  const nameRef = useRef(null);
  const descriptionRef = useRef(null);
  const selectedInstrumentId = useRef(0);
  const [selectedInstrumentName, setSelectedInstrumentName] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [searchResults, setSearchResults] = useState([]);
  const [selectedSongInfo, setSelectedSongInfo] = useState(null);

  const [instruments, setInstruments] = useState([
    {
      id: 1,
      instrumentName: "",
    },
  ]);


  useEffect(() => {
    async function fetchData() {
      const result = await instrumentApi.getAllInstruments();
      setInstruments(result.data);
    }
    fetchData();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const songInputRef = useRef();
  const handleSearch = () => {
    const songName = songInputRef.current.value;

    getSongByName(songName)
      .then((response) => {
        setSearchResults(response.data);
      })
      .catch((error) => {
      });
  };

  const handleInstrumentSelect = (id, name) => {
    selectedInstrumentId.current = id;
    setSelectedInstrumentName(name);
  };

  const handleSearchResultClick = (result) => {
    songInputRef.current.value = "";
    setSearchResults([]);
    setSelectedSongInfo(result);
  };

  const processImageFile = async (thumbnailBlobUrl) => {
    return fetch(thumbnailBlobUrl)
      .then((response) => response.blob())
      .then((blob) => {
        return blob;
      })
      .catch((error) => {
      });
  };

  const processVideoFile = async (videoBlobUrl) => {
    return fetch(videoBlobUrl)
      .then((response) => response.blob())
      .then((blob) => {
        return blob;
      })
      .catch((error) => {
      });
  };

  const handleSaveInfo = async () => {
    //정보저장
    const name = nameRef.current.value;
    const description = descriptionRef.current.value;
    const instrumentId = selectedInstrumentId.current;

    if (nameRef.current.value === "") {
      setErrorMsg("제목을 입력하세요.");
      return;
    } else if (descriptionRef.current.value === "") {
      setErrorMsg("설명을 입력하세요.");
      return;
    } else if (selectedInstrumentId.current === 0) {
      setErrorMsg("악기를 선택하세요.");
      return;
    }

    setErrorMsg("");



    const newSession = {
      ...session,
      instrumentId: instrumentId,
    };

    const song = {
      ...selectedSongInfo,
      songId: selectedSongInfo ? selectedSongInfo.id : null,
    };

    const newData = {
      ...data,
      name: name,
      description: description,
      songId: ( selectedSongInfo ? selectedSongInfo.id : null ),
      song: song,
      session: newSession,
      origins: origins,
    };

    //파일 변환 + api 호출
    const videoBlob = await processVideoFile(videoBlobUrl);
    const thumbnailBlob = await processImageFile(thumbnailBlobUrl);

    //const thumbnailBlob = thumbnailBlobUrl;
    setIsLoading(true);
    const result = await sessionApi.registSession(
      newData,
      videoBlob,
      thumbnailBlob
    );

    if (result.status === 201) {
      scrollToTop();
      navigate("/main", { state: { created: true } });
      //입력한 데이터 기본값으로 초기화.
    }
  };

  const DropdownItems = instruments.map((instrument) => (
    <Dropdown.Item
      onClick={() => {
        handleInstrumentSelect(instrument.id, instrument.instrumentName);
      }}
      key={instrument.id}
      eventKey={instrument.id}
    >
      {instrument.instrumentName}
    </Dropdown.Item>
  ));

  const [inputText, setInputText] = useState("");
  const inputHandler = (e) => {
    //convert input text to lower case
    const lowerCase = e.target.value.toLowerCase();
    setInputText(lowerCase);
  };

  return (
    <>
      <Modal className="modal-dialog-centered" show={isModalOpen}>
        <S.ModalContents>
          <Modal.Header>
            <Modal.Title>연주한 영상 정보를 입력해주세요!</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <S.ErrorBlock>{errorMsg}</S.ErrorBlock>
            <S.Form>
              <S.Label>제목</S.Label>
              <InputGroup>
                <InputText
                  ref={nameRef}
                  placeholder="영상 제목을 입력해 주세요."
                />
              </InputGroup>
              <S.Label>설명</S.Label>
              <InputGroup>
                <InputTextArea
                  ref={descriptionRef}
                  placeholder="영상 내용을 설명해 주세요."
                />
              </InputGroup>
              <S.Label>
                <div>악기 </div>

                <div
                  style={{
                    fontSize: "0.7em",
                    color: "#d7d7d7",
                  }}
                >
                  |
                </div>
                <div
                  style={{
                    fontSize: "0.8em",
                    color: "#d7d7d7",
                  }}
                >
                  지금 연주하신 악기를 선택합니다.
                </div>
              </S.Label>

              <InputGroup>
                <S.Dropdown>
                  <Dropdown.Toggle
                    className="mt-2"
                    variant="secondary"
                    id="dropdown-basic"
                  >
                    {selectedInstrumentName === null
                      ? "악기를 선택하세요."
                      : selectedInstrumentName}
                    &nbsp;
                  </Dropdown.Toggle>
                  <Dropdown.Menu>{DropdownItems}</Dropdown.Menu>
                </S.Dropdown>
              </InputGroup>
            </S.Form>

            <S.SearchContainer>
              <p></p>
              {selectedSongInfo ? (
                <>
                  <h5 className="mt-3">이 연주에 사용된 곡</h5>
                  <p style={{ color: "#d7d7d7", fontSize: "0.8em" }}>
                    <IoMusicalNotes
                      style={{ color: "green", fontSize: "1.2em" }}
                    />
                    &nbsp; {selectedSongInfo.name} <br />
                    {selectedSongInfo.artist}
                  </p>
                </>
              ) : (
                <>
                  <h5 className="mt-3">이 연주의 원곡이 있나요?</h5>
                  <p style={{ color: "#d7d7d7", fontSize: "0.8em" }}>
                    원곡 정보를 입력하세요. <br />더 많은 사람에게 나의 연주를
                    보여줄 수 있습니다.
                  </p>
                </>
              )}
              {selectedSongInfo && <p>다시 검색하기 : </p>}
              <SongSearchComponent
                ref={songInputRef}
                handleInputKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleSearch();
                  }
                }}
                handleSearchClick={handleSearch}
              />
              {searchResults.length > 0 && (
                <>
                  <S.SearchResultDropdown>
                    <S.SearchResultItem
                      style={{
                        position: "sticky",
                        top: "0px",
                        height: "auto",
                        background: "#111",
                      }}
                    >
                      <div></div>
                      <div>Title</div>
                      <div>Artist</div>
                    </S.SearchResultItem>
                    {searchResults.map((result, index) => (
                      <S.SearchResultItem
                        key={index}
                        onClick={() => {
                          handleSearchResultClick(result);
                        }}
                      >
                        <div></div>
                        <div>{result.name} </div>
                        <div>{result.artist}</div>
                      </S.SearchResultItem>
                    ))}
                  </S.SearchResultDropdown>
                </>
              )}

              <S.SearchSourceInfo>
                Powered by &nbsp; <img src={Spotify} width="60px" />
              </S.SearchSourceInfo>
            </S.SearchContainer>

            {isLoading && (
              <>
                <LoadingComponent />
              </>
            )}
            <div className="mt-3"></div>
            <Button onClick={handleSaveInfo} disabled={isLoading}>
              업로드 완료
            </Button>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              닫기
            </Button>
          </Modal.Body>
          <ModalFooter />
        </S.ModalContents>
      </Modal>
    </>
  );
}

const S = {
  ErrorBlock: styled.div`
    background: pink;
    color: red;
  `,

  ModalContents: styled.div`
    background: black;
    color: white;
    text-align: center;
  `,

  Form: styled.div`
    text-align: left;
  `,

  Label: styled.div`
    gap: 7px;
    margin-top: 0.5em;
    display: flex;
    align-items: center;
  `,

  Dropdown: styled(Dropdown)``,

  SearchContainer: styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
  `,

  SearchResultDropdown: styled.div`
    font-size: 0.8em;
    background-color: #222;
    color: white;
    width: auto;
    max-width: 90%;
    max-height: 200px;
    overflow-y: scroll;
    margin-top: 10px;
    text-align: left;

    &::-webkit-scrollbar {
      width: 8px;
      background-color: rgba(0 0 0 0);
    }

    &::-webkit-scrollbar-corner {
      background: rgba(0 0 0 0);
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background-color: gray;
    }
  `,

  SearchResultItem: styled.div`
    display: grid;
    grid-template-columns: 1fr 8fr 3fr;

    &:hover {
      color: green;
    }

    > div {
      overflow: hidden;
    }
  `,

  SearchSourceInfo: styled.div`
    font-size: 0.6em;
    color: #999;
    margin: 8px;
  `,
};

export default UploadRecordInfoModal;
