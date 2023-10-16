import { useRef, useState } from "react";
import styled from "styled-components";
import { Button, Badge, ListGroup, ListGroupItem } from "react-bootstrap";
import { getSearchVideosByKeyword } from "@/api/video";
import SearchBarComponent from "./SearchBarComponent";
import { ProfileImg } from "@/components";
import { getSearchVideosByKeywordForCompose } from "../../api/video";

function SessionSearchComponent({setSelectedVideoData}) {
  const inputRef = useRef(null);
  const [ videoSearchResult, setVideoSearchResult ] = useState(null);

  
  const defaultThumbnailSrc =
    "https://source.unsplash.com/1600x900/?succulent,green,dark,table";

  const handleInputKeyDown = (e) => {
    if (e.keyCode == 13) {
      search();
    }
  };

  const handleSearchClick = () => {
    search();
  };

  const search = async () => {
    const keyword = inputRef.current.value;
    if (keyword == "") {
      return;
    }
    
    const result = await getSearchVideosByKeywordForCompose(keyword);  
    setVideoSearchResult(result.data);
  };

  const handleVideoSelect = (video) => {
    setSelectedVideoData(video);
    setVideoSearchResult(null);
  }


  return (
    <>
      <SearchBarComponent
        ref={inputRef}
        handleInputKeyDown={handleInputKeyDown}
        handleSearchClick={handleSearchClick}
        placeholder="검색어를 입력하세요."
      />
      <div>
        {/*errorMsgBox*/}
      </div>
    
      {videoSearchResult && (
        <>
          <div style={{ textAlign: "center", marginTop: "10px" }}>
            <h4>검색 결과</h4>
            <div style={{ color: "#aaa", fontSize: "0.8em" }}>
              합주할 연주를 선택하세요.{" "}
            </div>
          </div>
        </>
      )}
      {videoSearchResult &&
        videoSearchResult.map((video) => (
          <>
            <S.SearchItem
              key={video.videoId}
              onClick={() => {
                handleVideoSelect(video);
              }}
            >
              <S.SearchItemLeft>
                <S.SearchVideoName>{video.name}</S.SearchVideoName>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "3px",
                    fontSize: '0.8em',
                    color: "#ccc"
                  }}
                >
                  <ProfileImg nickName={video.member.nickname} size={24} />
                  <div>{video.member.nickname}</div>
                </div>
              </S.SearchItemLeft>
              <S.SearchItemRight>
                

                <img
                  width="100px"
                  src={video.thumbnail ? video.thumbnail : defaultThumbnailSrc}
                />
              </S.SearchItemRight>
            </S.SearchItem>
          </>
        ))}
    </>
  );
}

const S = {
  TagList: styled.div`
    display: flex;
    gap: 5px;
  `,

  SearchBarContainer: styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
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
  `,

  SearchQuerySubmit: styled.button`
    width: 3.5rem;
    height: 2.8rem;
    color: white;
    margin-left: -3.5rem;
    background: none;
    border: none;
    outline: none;
    cursor: pointer;
  `,

  SearchItem: styled.div`
    cursor: pointer;
    border: 1px solid rgba(0, 0, 0, 0);
    border-bottom: 1px solid #222;
    border-radius: 3px;
    height: 64px;
    margin-left: 20px;
    margin-right: 30px;
    padding-left: 10px;
    padding-bottom: 5px;
    margin-top: 5px;
    display: flex;
    align-items: center;
    gap: 20px;
    justify-content: space-between;
    transition: border 0.3s;

    &:hover {
      border: 1px solid orange;
    }
  `,

  SearchVideoName: styled.div`
    white-space:nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `,

  SearchItemLeft: styled.div`
    width: 100%;
    padding:0 5px;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
  `,

  SearchItemRight: styled.div`
    display: flex;
    gap: 5px;
    align-items: center;
   
  `,

  ButtonContainer: styled.div`
    display: flex;
    justify-content: center;
  `,
};

export default SessionSearchComponent;
