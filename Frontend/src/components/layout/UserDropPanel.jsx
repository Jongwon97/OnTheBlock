import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CgProfile as ProfileIcon } from "react-icons/cg";
import { getNotices, deleteNotice } from "../../api/notice";
import Button from "react-bootstrap/Button";
import styled from "styled-components";
import { EventSourcePolyfill } from "event-source-polyfill";
import { ProfileImg } from "@/components";
import {TiDelete} from "react-icons/ti"
import * as hooks from "@/hooks";
import { getVideo } from "@/api/video";
import { FaChevronRight as RightIcon } from "react-icons/fa";

function UserDropPanel({
  userInfoVisibility,
  onNewNotice,
  onReadAll,
  hasUnread,
  setHasUnread,
}) {
  const navigate = useNavigate();

  const [nickName, setNickName] = useState(localStorage.getItem("nickName"));
  const [notice, setNotice] = useState([]);
  const [eventSource, setEventSource] = useState(null);

  const { setIsVideoModalOpen } = hooks.videoModalState();
  const { openVideoData } = hooks.openVideoState();
  const { setOpenVideoData } = hooks.openVideoState();

  useEffect(() => {
    // 알림 초기값 가져오기
    getNotices()
      .then((response) => {
        const { memberNotices } = response.data;
        memberNotices.forEach((notice) => {
          notice.message = generateMessage(notice);
        });
        setNotice(memberNotices);
        setHasUnread(response.data.hasUnread === 1);
      })
      .catch((error) => {
      });

    // 토큰으로 알림 SSE 연결해서 실시간으로 받아오기
    const token = localStorage.getItem("accessToken");
    if (token != null) {
      let eventSource = new EventSourcePolyfill(
        `http://localhost:9999/ontheblock/api/notice/subscribe/check`,
        {
          headers: {
            accessToken: token,
          },
          heartbeatTimeout: 600000,
        }
      );
      setEventSource(eventSource);

      // EventListener로 알림 받아오기
      eventSource.addEventListener("sse", function (event) {
        

        const newNotice = JSON.parse(event.data);

        if (
          typeof newNotice.id === "number" &&
          typeof newNotice.noticeContent === "string"
        ) {
          newNotice.message = generateMessage(newNotice);

          // 'noticeContent'를 JSON으로 파싱
          const noticeContentJson = JSON.parse(newNotice.noticeContent);
          // 알림 타입에 따른 메시지 생성
          let message;
          switch (newNotice.noticeType) {
            case 1:
              // 타입1: 팔로우 알림 (id, nickname)
              //<b>{noticeContentJson.nickname}</b>
              message = <>님이 회원님을 팔로우하였습니다.</>;
              break;

            case 2:
              // 타입2: 좋아요 알림 (id, nickname, videoId)
              message = <>님이 회원님의 영상을 좋아합니다.</>;
              break;

            case 3:
              // 타입3: 댓글 알림 (id, nickname, videoId)
              message = <>님이 댓글을 달았습니다.</>;
              break;

            case 4:
              // 타입4: 영상 스크랩 알림 (id, nickname, videoId)
              message = <>님이 회원님의 연주에 합주했습니다!</>;
              break;

            default:
              message = "알 수 없는 유형의 새로운 알림";
              break;
          }

          newNotice.message = message;

          setNotice((prevNotices) => [...prevNotices, newNotice]);
          onNewNotice(); // 새로운 알림이 도착했음을 부모 컴포넌트에게 알립니다.
        }
      });

      eventSource.onerror = function (error) {

        // readyState === 0: CONNECTING, 1: OPEN, 2: CLOSED
        if (eventSource.readyState === EventSource.CLOSED) {

          // 5000ms 이후 재연결
          setTimeout(() => {
            eventSource = new EventSourcePolyfill(
              `http://localhost:9999/ontheblock/api/notice/subscribe/check`,
              { headers: { accessToken: token } }
            );
          }, 5000);
        }
      };

      return () => {
        // SSE 연결을 닫습니다.
        eventSource.close();
      };
    }
  }, []);

  // 가져온 알림을 형식에 맞춰서 표출
  const generateMessage = useCallback((newNotice) => {
    const noticeContentJson = JSON.parse(newNotice.noticeContent);

    // 알림 타입에 따른 메시지 생성
    let message;
    switch (newNotice.noticeType) {
      case 1:
        // 타입1: 팔로우 알림 (id, nickname)
        message = <>님이 회원님을 팔로우하였습니다.</>;
        break;

      case 2:
        // 타입2: 좋아요 알림 (id, nickname, videoId)
        message = <>님이 회원님의 영상을 좋아합니다.</>;
        break;

      case 3:
        // 타입3: 댓글 알림 (id, nickname, videoId)
        message = <>님이 댓글을 달았습니다</>;
        break;

      case 4:
        // 타입4: 영상 스크랩 알림 (id, nickname, videoId)

        message = <>님이 회원님의 연주에 합주했습니다!</>;
        break;

      default:
        message = "알 수 없는 유형의 새로운 알림";
        break;
    }

    return message;
  }, []);

  const getNoticeLink = (noticeType, noticeContent) => {
    switch (noticeType) {
      case 1: // 팔로우 알림 링크
        return `/profile/${noticeContent.id}`;

      case 2: // 좋아요 알림 링크
        return `/video/${noticeContent.videoId}`;

      case 3: // 댓글 알림 링크
        return `/video/${noticeContent.videoId}`;

      case 4: // 영상 스크랩 알림 링크
        return `/video/${noticeContent.videoId}`;

      default:
        return "/main";
    }
  };

  const handleNoticeProfileClick = (memberId) => {
    navigate(`/profile/${memberId}`);
  };

  const handleNoticeClick = async(noticeType, noticeContent, noticeId) => {


    if(!noticeContent) return;

    switch (noticeType) {
      case 1: // 팔로우 알림 링크
        navigate(`/profile/${noticeContent.id}`);
        return;

        case 2:
        case 3:
        case 4:
        {
          const response = await getVideo(JSON.parse(noticeContent).videoId);
          await setOpenVideoData(response.data);
          setIsVideoModalOpen(true);
        } 
        return;
      default:
        return "/main";
    }
  };

  const sendDeleteNotice = (noticeId) => {
    setNotice(notice.filter((item) => item.id !== noticeId));

    deleteNotice(noticeId)
      .then(() => {
        
      })
      .catch((error) => {
        
      });
  };

  // 로그 아웃
  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    if (eventSource) {
      eventSource.close();
      setEventSource(null);
    }

    window.location.href = "/";
  };

  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <S.Wrap $userInfoVisibility={userInfoVisibility}>
        <S.ProfileContainer onClick={() => {navigate("/mypage/like");scrollToTop();}}>
          <S.PanelTopText>
            <div style={{display: "flex", gap:"5px", marginLeft: "5px"}}>
              <ProfileImg nickName={nickName} size="32" />
              <div style={{ color: "orange", fontSize: "1.2em", marginLeft: "5px" }}>
                <b>{nickName}</b>
              </div>
            </div>
            <div style={{ color: "#d7d7d7", fontSize: "0.8em", marginLeft: "10px"}}>
              마이페이지로 이동 <RightIcon color="#d7d7d7" />
            </div>
          </S.PanelTopText>

          {/* <div style={{ color: "#d7d7d7" }}>
              <b>팔로워 0명&nbsp;|&nbsp;팔로잉 0명</b>
            </div> */}
        </S.ProfileContainer>

        <S.NoticeContainer>
          {notice.map((item, index) => (
            <S.NoticeItem key={index}>
              <ProfileImg
                nickName={JSON.parse(item.noticeContent).nickname}
                size="24"
                onClick={() => {
                  handleNoticeProfileClick(JSON.parse(item.noticeContent).id);
                }}
              />
              <S.StyledMessage>
                <span
                  onClick={() => {
                    handleNoticeProfileClick(JSON.parse(item.noticeContent).id);
                  }}
                >
                  <b>{JSON.parse(item.noticeContent).nickname}</b>
                </span>
                <span
                  onClick={() => {
                    handleNoticeClick(
                      item.noticeType,
                      item.noticeContent,
                      item.id
                    );
                  }}
                >
                  {item.message}
                </span>
              </S.StyledMessage>
              <TiDelete
                size="20"
                color="#f77e65"
                onClick={() => sendDeleteNotice(item.id)}
              />
            </S.NoticeItem>
          ))}
          {notice.length === 0 && (
            <div style={{ fontSize: "0.8em", textAlign: "center" }}>
              새로 등록된 알림이 없습니다.
            </div>
          )}
        </S.NoticeContainer>

        <hr style={{ margin: 0 }}></hr>
        <S.ButtonContainer>
          <Button variant="dark" onClick={logout}>
            로그아웃
          </Button>
        </S.ButtonContainer>
      </S.Wrap>
    </>
  );
}

const S = {
  Wrap: styled.div`
    visibility: ${(props) =>
      props.$userInfoVisibility ? "visible" : "hidden"};
    border-radius: 0 0 8px 8px;
    top: 56px;
    right: 16px;
    position: absolute;
    min-width: 320px;
    width: fit-content;
    background: #ccbab0;
    text-align: left;
    filter: drop-shadow(2px 2px 5px #131313);
    cursor: default;
  `,

  /* Allow pointer interactions -   pointer-events: auto; */

  PanelTopText: styled.div`
  width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  `,

  ProfileContainer: styled.div`
    padding: 8px;
    display: flex;
    gap: 8px;
    background: #131313;
    cursor: pointer;
  `,

  NoticeContainer: styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 8px;
  `,

  NoticeItem: styled.div`
    background: rgba(100, 100, 100, 0);
    transition: background 0.3s ease-out;
    border-radius: 5px;
    padding: 3px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;

    &:hover {
      background: rgba(100, 100, 100, 0.2);
    }
  `,

  ButtonContainer: styled.div`
    display: flex;
    justify-content: end;
    align-items: center;
    padding: 8px;
  `,

  Description: styled.div`
    text-align: center;
    margin-top: 10px;
    margin-bottom: 10px;
    white-space: pre-wrap;
    cursor: pointer;
    color: #d7d7d7;
  `,

  Description2: styled.div`
    text-align: center;
    margin-top: 10px;
    margin-bottom: 10px;
    white-space: pre-wrap;
    color: #d7d7d7;
    margin-left: 20px;
    margin-right: 20px;
  `,

  DescriptionWrap: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,

  StyledMessage: styled.div`
    color: black;
  `,

  StyledLink: styled(Link)`
    color: black;
    text-decoration: none;
  `,
};
export default UserDropPanel;
