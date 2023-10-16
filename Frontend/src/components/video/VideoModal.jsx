import {
  Modal,
  Container,
  InputGroup,
  Row,
  Col,
  Button,
  Form,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useState, useEffect, useRef, memo } from "react";
import * as hooks from "@/hooks";

import { IoMusicalNotes } from "react-icons/io5";
import {
  RiPencilFill as PencilIcon,
  RiDeleteBinLine as DeleteIcon,
} from "react-icons/ri";
import {
  MdOutlineReportProblem as ReportIcon,
  MdPlaylistAddCircle as CompositionIcon,
} from "react-icons/md";
import {
  AiOutlineComment as CommentIcon,
  AiFillHeart as HeartIconFull,
  AiOutlineHeart as HeartIconEmpty,
  AiOutlineEye as WatchIcon,
} from "react-icons/ai";
import { FaChevronRight as RightIcon } from "react-icons/fa";
import { IoIosSend as SendIcon } from "react-icons/io";

import { ProfileImg, Comment } from "@/components";
import VideoComponent from "./VideoComponent";

import * as videoApi from "@/api/video.js";
import { getVideo, videoRemove } from "@/api/video";

//S.Modal onHide={handleClose}
function VideoModal() {
  // id값 받고 영상 불러와서 표시하기.
  const { isVideoModalOpen } = hooks.videoModalState();
  const { setIsVideoModalOpen } = hooks.videoModalState();
  const { openVideoId } = hooks.openVideoState();
  const { openVideoData } = hooks.openVideoState();

  const { setOpenVideoId } = hooks.openVideoState();
  const { setOpenVideoData } = hooks.openVideoState();
  const { sessionsMap } = hooks.openVideoState();
  const { setSessionsMap } = hooks.openVideoState();

  const navigate = useNavigate();

  const commentRef = useRef(null);
  const commentSectionRef = useRef(null);
  const [newSessionsMap, setNewSessionsMap] = useState(new Map());

  const [likeCheck, setLikeCheck] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentData, setCommentData] = useState([]);

  const deleteVideo = (video_id) => {
    videoRemove(video_id).then((response) => {
      setIsVideoModalOpen(false);
      location.reload();
    });

  };

  const [playerFrame, setPlayerFrame] = useState(9000);

  useEffect(() => {
    const tempSessionsMap = new Map();
    let maxFrame = 0;
    for (const session of openVideoData.sessions) {
      const sessionPosition = session.sessionPosition;
      maxFrame = Math.max(session.totalFrame + session.startPoint, maxFrame);
      tempSessionsMap.set(sessionPosition, session);
    }
    setNewSessionsMap(tempSessionsMap);
    setPlayerFrame(maxFrame);
    setLikeCheck(openVideoData.likeCheck);
    setLikeCount(openVideoData.likeCount);
    setCommentData(openVideoData.comments);
  }, [openVideoData]);

  useEffect(() => {
    setSessionsMap(newSessionsMap);
  }, [newSessionsMap]);

  const getVideoData = async () => {
    const response = await getVideo(openVideoData.videoId);
    setOpenVideoData(response.data);
  };

  const getCommentData = async () => {
    const response = await getVideo(openVideoData.videoId);
    if (response.data) {
      setCommentData(response.data.comments);
    }
  };

  const handleNewComposition = () => {
    if (openVideoData.sessions.length >= 5) {
      alert(
        "합주 인원이 꽉 찼어요!\n하나의 합주에 최대 5개의 연주까지 참여할 수 있습니다."
      );
      return;
    }
    setIsVideoModalOpen(false);
    navigate("/record/composition", { state: { id: openVideoData.videoId } });
  };

  const handleLike = async (isVideoLiked) => {
    //let 사용이 적절한지 검토.
    let response = null;
    if (isVideoLiked) {
      response = await videoApi.like(openVideoData.videoId);
      if (response) {
        setLikeCheck(!likeCheck);
        setLikeCount(likeCount + 1);
      }
    } else {
      response = await videoApi.likeCancel(openVideoData.videoId);
      if (response) {
        setLikeCheck(!likeCheck);
        setLikeCount(likeCount - 1);
      }
    }
  };

  const handleCommentKeyDown = (e) => {
    if (e.keyCode == 13) {
      postComment();
    }
  };

  const postComment = async () => {
    if (commentRef.current.value == "") {
      return;
    }

    const commentData = {
      commentId: null,
      memberId: null,
      videoId: openVideoData.videoId,
      content: commentRef.current.value,
    };

    const response = await videoApi.registComment(commentData);
    if (response) {
      commentRef.current.value = "";
      commentSectionRef.current.scrollTo(0, 0);
      getCommentData();
    }
  };

  const handleSessionMemberClick = (memberId) => {
    setIsVideoModalOpen(false);
    navigate(`/profile/${memberId}`);
  };

  return (
    <>
      <S.Modal
        className="modal-xl modal-dialog-centered"
        show={isVideoModalOpen}
        onHide={() => setIsVideoModalOpen(false)}
      >
        <S.Body>
          <div className="row">
            <div className="col-lg-8 col-md-12">
              {isVideoModalOpen && (
                <VideoComponent maximumFrame={playerFrame} />
              )}
            </div>
            <div className="col-lg-4 col-md-12">
              <div>
                <S.VideoInfoTopText>
                  <S.VideoName>  {openVideoData.name}</S.VideoName>
                  {/* 영상을 업로드한 memberId와 로컬에 저장된 memberId가 일치할 경우만 삭제 버튼 보임 */}
                  <div>
                  {openVideoData.member.memberId ===
                    Number(localStorage.getItem("memberId")) && (
                    <>
                      <div
                        style={{ cursor: "pointer", width: '100%', textAlign: 'right', }}
                        onClick={() => deleteVideo(openVideoData.videoId)}
                      >
                        <span style={{ color: "red", fontSize: "0.8em" }}>
                          동영상 삭제
                        </span>
                        &nbsp;
                        <DeleteIcon color="red" />
                      </div>
                    </>
                  )}

                  </div>
                </S.VideoInfoTopText>
                
                <div
                  style={{ display: "flex", alignItems: "center", gap: "2px" }}
                >
                  <ProfileImg
                    nickName={openVideoData.member.nickname}
                    size="24"
                  />
                  <small
                    style={{ cursor: "pointer", marginLeft: "5px" }}
                    onClick={() =>
                      handleSessionMemberClick(openVideoData.member.memberId)
                    }
                  >
                    {openVideoData.member.nickname}
                  </small>
                </div>
                <p style={{ marginTop: "10px" }}>
                  <small style={{ fontSize: "16px" }}>
                    {openVideoData.description}
                  </small>
                </p>
              </div>
              <div className="mt-5">
                <div>
                  {openVideoData.song && (
                    <p>
                      <IoMusicalNotes color="green" /> &nbsp;
                      <span style={{ fontSize: "0.8em" }}>
                        {openVideoData.song.artist + " "} -{" "}
                        {" " + openVideoData.song.name}
                      </span>
                    </p>
                  )}
                </div>
                <hr />
                <p>
                  {openVideoData.sessions.length}
                  <span style={{ fontSize: "0.8em" }}>
                    명의 아티스트가 이 연주에 참여하였습니다.
                  </span>
                </p>
                <p></p>
                <S.ContributerContainer>
                  {openVideoData.sessions.map((session, index) => (
                    <ProfileImg
                      key={index}
                      className="p-icon"
                      nickName={session.member.nickname}
                      size="24"
                    />
                  ))}
                  <RightIcon />
                </S.ContributerContainer>
                <S.ContributerList>
                  {openVideoData.sessions.map((session, index) => (
                    <div
                      key={index}
                      style={{
                        marginBottom: "5px",
                        marginLeft: "5px",
                        display: "flex",
                        cursor: "pointer",
                        alignItems: "center",
                      }}
                      onClick={() =>
                        handleSessionMemberClick(session.member.memberId)
                      }
                    >
                      <ProfileImg
                        nickName={session.member.nickname}
                        size="24"
                      />
                      &nbsp;
                      <div
                        style={{ marginLeft: "3px", marginBottom: "5px" }}
                        onClick={() =>
                          navigate(`/profile/${session.member.memberId}`)
                        }
                      >
                        {session.member.nickname}
                      </div>
                      &nbsp;|&nbsp;
                      <div>{session.instrument}</div>
                    </div>
                  ))}
                </S.ContributerList>
              </div>
            </div>
          </div>
          <S.IconBar>
            <div>
              <CommentIcon /> <small>{commentData.length}</small>
              &nbsp;
              <span style={{ cursor: "pointer" }}>
                {likeCheck ? (
                  <>
                    <HeartIconFull
                      style={{ color: "red", position: "relative" }}
                      onClick={() => {
                        handleLike(false);
                      }}
                    />
                  </>
                ) : (
                  <HeartIconEmpty
                    onClick={() => {
                      handleLike(true);
                    }}
                  />
                )}
              </span>{" "}
              <small>{likeCount}</small>
              &nbsp;
              <WatchIcon /> <small>{openVideoData.watchCount}</small>
            </div>
            <div>
              <S.NewCompositionBtn onClick={handleNewComposition}>
                <CompositionIcon />
                <small>이 영상에 합주하기</small>
              </S.NewCompositionBtn>
              &nbsp;
              <span>
                <ReportIcon />
              </span>
            </div>
          </S.IconBar>
          <S.CommentSection ref={commentSectionRef}>
            {commentData &&
              commentData.length > 0 &&
              commentData.map((comment) => (
                <Comment
                  key={comment.commentId}
                  comment={comment}
                  getCommentData={getCommentData}
                  videoId={openVideoData.videoId}
                  handleSessionMemberClick={handleSessionMemberClick}
                />
              ))}
          </S.CommentSection>
          <S.CommentInputContainer>
            <ProfileImg nickName={localStorage.getItem("nickName")} size="24" />

            <S.CommentInput
              ref={commentRef}
              placeholder="댓글을 입력하세요."
              onKeyDown={(e) => handleCommentKeyDown(e)}
            />
            <S.PostCommentBtn
              onClick={postComment}
              className="btn-dark"
              id="button-addon2"
            >
              <SendIcon size="16" />
            </S.PostCommentBtn>
          </S.CommentInputContainer>
        </S.Body>
      </S.Modal>
    </>
  );
}

const S = {
  Modal: styled(Modal)`
    .modal-content {
      background-color: #131313;
    }
  `,

  Header: styled(Modal.Header)`
    border-bottom: 2px solid #fff;
  `,

  Title: styled(Modal.Title)`
    color: #fff;
  `,

  Body: styled(Modal.Body)`
    color: #fff;
    background: rgba(13, 13, 13);
    border-top: none;
  `,

  VideoName: styled.div`
    width: 100%;
    white-space:nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `,

  VideoInfoTopText: styled.div`
    justify-content: space-between;
    color: #f4b183;
    font-weight: bold;
    margin-bottom: 25px;
    width: 100%;
  `,

  IconBar: styled(Container)`
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 2em;

    small {
      font-size: 0.5em;
    }
  `,

  ContributerContainer: styled.div`
    display: flex;
    align-items: center;
    justify-content: end;
    gap: 0;

    .p-icon {
      margin-left: -0.3em;
    }
  `,

  ContributerList: styled.div`
    font-size: 0.8em;
  `,

  NewCompositionBtn: styled.span`
    cursor: pointer;
  `,

  CommentSection: styled.div`
    margin-top: 20px;
    height: 120px;
    overflow: scroll;

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

    /*Add Mozilla scrollbar style*/

    @media screen and (min-width: 1025px) {
      margin-left: 80px;
      margin-right: 80px;
    }

    @media screen and (min-width: 769px) and (max-width: 1024px) {
      margin-left: 40px;
      margin-right: 40px;
    }

    @media screen and (max-width: 768px) {
      margin-left: 20px;
      margin-right: 20px;
    }
  `,

  CommentInputContainer: styled.div`
    @media screen and (min-width: 1025px) {
      padding-left: 80px;
      padding-right: 80px;
    }

    @media screen and (min-width: 769px) and (max-width: 1024px) {
      padding-left: 40px;
      padding-right: 40px;
    }

    @media screen and (max-width: 768px) {
      padding-left: 20px;
      padding-right: 20px;
    }

    display: flex;
    align-items: center;
    gap: 3px;
  `,

  CommentInput: styled.input`
    flex: 1;
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
    width: auto;
    color: #f2f2f2;

    &:focus {
      background: #555;
      -webkit-transition: 0.5s;
      transition: 0.5s;
    }

    &::placeholder {
      font-size: 0.9em;
      color: #f2f2f2;
    }
  `,

  PostCommentBtn: styled.div`
    margin-top: 0.8px;
    height: 32px;
    width: 32px;
    cursor: pointer;
    margin-left: -10px;
    background-color: #111;
    border: 0.5px solid #333;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 4px;

    &:hover {
      background-color: black;
      transition: background-color 0.3s;
    }
  `,
};

export default VideoModal;
