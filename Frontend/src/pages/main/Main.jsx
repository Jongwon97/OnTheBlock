import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import InstBanner1 from "@/assets/banners/instruments1.jpg";
import {
  ThumbnailSwiper,
  NewRecordModal,
  NewRecordSessionSearchModal,
  SearchBarComponent,
  VideoSearchResultModal,
} from "@/components";
import { PiMusicNotesPlus } from "react-icons/pi";
import { getMyInstruments } from "@/api/instrument";
import {
  getLatestVideoList,
  getFollowVideos,
  getRecommendVideos,
} from "@/api/video";
import { getSongByName } from "@/api/song";
import { getSearchVideosByKeyword } from "@/api/video";

import * as hooks from "@/hooks";

function Main() {
  const navigate = useNavigate();

  const [isNewRecordOpen, setIsNewRecordOpen] = useState(false);
  const [isSessionSearchOpen, setIsSessionSearchOpen] = useState(false);
  const [isVideoSearchResultOpen, setIsVideoSearchResultOpen] = useState(false);
  //const [isCreatedOpen, setIsCreatedOpen] = useState(false);
  //모달 사용하지 않음, 삭제대기
  const location = useLocation();
  const [latestVideoList, setLatestVideoList] = useState(null);
  const [followVideoList, setFollowVideoList] = useState(null);
  const [recommendVideoList, setRecommendVideoList] = useState(null);

  const [videoSearchResults, setVideoSearchResults] = useState([]);

  const inputRef = useRef();
  

  const handleSearchInputKeyDown = (e) => {
    if (e.keyCode == 13) {
      const keyword = inputRef.current.value;
      searchSong(keyword);
    }
  };

  const handleSearchClick = () => {
    const keyword = inputRef.current.value;
    searchSong(keyword);
  };

  const searchSong = (keyword) => {
    if (keyword.length < 1) {
      alert("검색어를 입력해주세요.");
      return;
    }

    getSearchVideosByKeyword(keyword)
      .then((response) => {
        setVideoSearchResults(response.data);
        setIsVideoSearchResultOpen(true);
      })
      .catch((error) => {

      });
  };

  useEffect(() => {
    getMyInstruments().then((response) => {
      
    });

    getLatestVideoList().then((response) => {
      setLatestVideoList(response.data);
    });

    getFollowVideos().then((response) => {
      setFollowVideoList(response.data);
    });

    getRecommendVideos().then((response) => {
      setRecommendVideoList(response.data);
    });
  }, []);

  return (
    <S.Wrap>
      <S.BannerWrapper>
        {location.state && location.state.created ? (
          <S.RecordedBannerContainer>
            <h4>
              <b>연주가 완료되었습니다!</b>
            </h4>
            <p>
              업로드한 영상은 마이페이지 - 나의 프로필에서 확인할 수 있습니다.
            </p>
            <S.RecordNewMusicSmallBtn onClick={setIsNewRecordOpen}>
              <PiMusicNotesPlus size="2em" style={{ paddingBottom: "5px" }} />
              <div>새 연주 시작하기</div>
            </S.RecordNewMusicSmallBtn>
            <div style={{ marginTop: "48px", width: "40%" }}>
            <SearchBarComponent
              ref={inputRef}
              handleInputKeyDown={handleSearchInputKeyDown}
              handleSearchClick={handleSearchClick}
              placeholder="검색어를 입력하세요."
            />
            </div>
          </S.RecordedBannerContainer>
        ) : (
          <S.BannerContainer>
            <h4>
              <b>오늘은 어떤 음악을 연주해 볼까요?</b>
            </h4>

            <b>하단의 버튼을 눌러 새 연주를 시작해보세요.</b>
            <S.RecordNewMusicSmallBtn onClick={setIsNewRecordOpen}>
              <PiMusicNotesPlus size="1em" />
              <div>새 연주 시작하기</div>
            </S.RecordNewMusicSmallBtn>
            <div style={{ marginTop: "48px", width: "40%" }}>
              <SearchBarComponent
                ref={inputRef}
                handleInputKeyDown={handleSearchInputKeyDown}
                handleSearchClick={handleSearchClick}
                placeholder="듣고 싶은 연주를 검색해보세요."
              />
            </div>
          </S.BannerContainer>
        )}
      </S.BannerWrapper>

      <S.ThumbnailContainer>
        <h4>
          <b>맞춤형 추천 연주</b>
        </h4>
        <ThumbnailSwiper
          videoList={recommendVideoList}
          emptyMsg={
            "💡 나의 관심 정보를 업데이트하고, 연주 활동을 시작해보세요. OnTheBlock에서 나만을 위한 연주 영상을 찾아드립니다."
          }
        />
      </S.ThumbnailContainer>

      <S.ThumbnailContainer>
        <h4>
          <b>내가 팔로우한 이용자의 연주</b>
        </h4>
        <ThumbnailSwiper
          videoList={followVideoList}
          emptyMsg={
            "💡 다른 이용자들을 팔로우하고, 더 많은 연주 영상을 만나보세요."
          }
        />
      </S.ThumbnailContainer>
      <S.ThumbnailContainer>
        <h4>
          <b>최근에 업로드된 연주</b>
        </h4>
        <ThumbnailSwiper videoList={latestVideoList} />
      </S.ThumbnailContainer>
      <NewRecordModal
        isModalOpen={isNewRecordOpen}
        setIsModalOpen={setIsNewRecordOpen}
        setIsSessionSearchOpen={setIsSessionSearchOpen}
      />

      <NewRecordSessionSearchModal
        isModalOpen={isSessionSearchOpen}
        setIsModalOpen={setIsSessionSearchOpen}
      />

      <VideoSearchResultModal
        isModalOpen={isVideoSearchResultOpen}
        setIsModalOpen={setIsVideoSearchResultOpen}
        keyword={inputRef.current && inputRef.current.value}
        videoSearchResult={videoSearchResults}
      />
    </S.Wrap>
  );
}

const S = {
  Wrap: styled.div`
    background: #252525;
    padding: 0px;
    color: white;
  `,

  BannerWrapper: styled.div`
    height: 500px;
  `,

  RecordedBannerContainer: styled.div`
    background: url(${InstBanner1});
    background-size: cover;
    box-shadow: inset 0 0 0 2000px rgba(252, 185, 149, 0.5);
    height: 100%;

    display: flex;
    flex-direction: column;
    gap: 16px;
    text-align: center;
    justify-content: center;
    align-items: center;

    > * {
      filter: drop-shadow(1px 1px 2px #332111);
    }
  `,

  BannerContainer: styled.div`
    background: url(${InstBanner1});
    background-size: cover;
    box-shadow: inset 0 0 0 2000px rgba(252, 185, 149, 0.5);
    height: 100%;

    display: flex;
    flex-direction: column;
    gap: 16px;
    text-align: center;
    justify-content: center;
    align-items: center;

    > * {
      filter: drop-shadow(1px 1px 1px #332111);
    }
  `,

  RecordNewMusicBtn: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;

    height: 192px;
    width: 256px;
    background: #a66959;
    cursor: pointer;
    border-radius: 16px;
  `,

  RecordNewMusicSmallBtn: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1em;
    font-weight: bold;
    gap: 5px;

    width: auto;
    height: 32px;
    background: #a66959;
    cursor: pointer;
    padding: 12px;
    border-radius: 16px;
  `,

  ThumbnailContainer: styled.div`
    padding: 48px 72px 48px 72px;
  `,

  SearchContainer: styled.div`
    position: relative;
    width: fit-content;
  `,

  SearchResultDropdown: styled.div`
    position: absolute;
    top: 100%;
    background-color: white;
    color: black;
    z-index: 1;
    width: fit-content;
    max-height: 400px;
    overflow-y: auto;
    margin-top: 10px;
    width: 300px;
  `,
};

export default Main;
