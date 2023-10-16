import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { ThumbnailGrid, EmptyMsgContainer } from "@/components";
import Pagination from "react-bootstrap/Pagination";
import { getLikeVideos, getWatchVideos } from "@/api/video";
import * as hooks from "@/hooks";
import {
  AiOutlineComment as CommentIcon,
  AiFillHeart as HeartIconFull,
  AiOutlineHeart as HeartIconEmpty,
  AiOutlineEye as WatchIcon,
} from "react-icons/ai";

function MyPageGridContent() {
  const navigate = useNavigate();

  const { option } = useParams();

  const renderItem = {
    like: {
      title: "좋아요 표시한 영상",
      api: getLikeVideos, //실제 해당하는 api로 교체할 것.
    },
    history: {
      title: "내가 시청한 영상",
      api: getWatchVideos, //실제 해당하는 api로 교체할 것.
    },
  };

  const emptyMsg = {
    like: "💡 관심 있는 연주 영상에 좋아요♥를 누르고, 내 맘에 드는 연주들을 모아서 보세요.",
    history: "💡 OnTheBlock에서 다양한 연주 영상들을 만나보세요! 시청한 영상들을 바탕으로 좋아하는 연주들을 찾아드립니다.",
  }

  const [currentPage, setCurrentPage] = useState(1);
  //const { latestVideoList: videoList, setLatestVideoList: setVideoList } = hooks.videoListState();
  const [ videoList, setVideoList ] = useState(null);
  const pages = (videoList ? videoList.length / 9 : 0);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    const api = renderItem[option].api;
    api().then((response) => {
      setVideoList(response.data);
    });
  }, [option]);

  return (
    <>
      <S.Wrap>
        <S.ThumbnailContainer>
          <h4>
            <b>{renderItem[option].title}</b>
          </h4>
          <ThumbnailGrid videoList={videoList} />
          {(!videoList || videoList.length === 0) && (
            <EmptyMsgContainer height="400px" emptyMsg={emptyMsg[option]} />
          )}
        </S.ThumbnailContainer>
        {/*
        <S.PaginationWrapper>
          <Pagination>
            <Pagination.First onClick={() => handlePageChange(1)} />
            <Pagination.Prev
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            />
            {[...Array({ pages })].map((_, index) => (
              <Pagination.Item
                key={index + 1}
                active={index + 1 === currentPage}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pages}
            />
            <Pagination.Last onClick={() => handlePageChange({ pages })} />
          </Pagination>
        </S.PaginationWrapper>*/}
      </S.Wrap>
    </>
  );
}

const S = {
  Wrap: styled.div`
    background: #252525;
    color: white;
    overflow: hidden;
    padding-top: 20px;
    padding-bottom: 20px;
  `,

  ThumbnailContainer: styled.div`
    padding: 48px 72px 48px 72px;
    max-width: 100vw;
  `,

  PaginationWrapper: styled.div`
    display: flex;
    justify-content: center;
    margin-top: 20px;

    .page-link {
      color: orange;
      background-color: black;
      border-color: black;

      &:hover {
        background-color: black;
        border-color: black;
      }
    }

    .page-item.active .page-link {
      background-color: black; //
      border-color: orange;
    }
  `,
};

export default MyPageGridContent;
