import styled from "styled-components";
import { useState, useEffect, useRef, memo } from "react";

import {
  RiPencilFill as PencilIcon,
  RiDeleteBinLine as DeleteIcon,
} from "react-icons/ri";

import { ProfileImg } from "@/components";

import * as videoApi from "@/api/video.js";

function Comment({
  comment,
  getCommentData,
  videoId,
  handleSessionMemberClick,
}) {
  const [editable, setEditable] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (editable) {
      inputRef.current.focus();
    }
  }, [editable]);

  const toggleCommentEdit = () => {
    setEditable(!editable);
  };

  const handleCommentEdit = () => {
    setEditable(false);
    const editedValue = inputRef.current.value;
    postCommentEdit(comment.commentId, editedValue);
  };

  const handleCommentDelete = async (commentId) => {
    const response = await videoApi.commentRemove(commentId);
    if (response) {
      getCommentData();
    }
  };

  const postCommentEdit = async (commentId, content) => {
    const commentData = {
      commentId: commentId,
      memberId: null,
      videoId: videoId,
      content: content,
    };
    const response = await videoApi.commentUpdate(commentData);
    if (response) {
      getCommentData();
    }
  };

  return (
    <>
      <S.CommentItem key={comment.commentId}>
        <div style={{ marginTop: "5px" }}>
          <ProfileImg
            nickName={comment.member.nickname}
            size="24"
            onClick={() => handleSessionMemberClick(comment.member.memberId)}
          />
        </div>
        <S.CommentBody>
          <S.NickNameLabel
            onClick={() => handleSessionMemberClick(comment.member.memberId)}
          >
            {comment.member.nickname}
          </S.NickNameLabel>
          <S.CommentContentContainer>
            <S.CommentContent>
              {editable ? (
                <S.CommentEditArea
                  ref={inputRef}
                  defaultValue={comment.content}
                />
              ) : (
                <S.CommentArea>{comment.content}</S.CommentArea>
              )}
            </S.CommentContent>
            <S.CommentEditButtons>
              {Number(comment.member.memberId) ===
                Number(localStorage.getItem("memberId")) && (
                <>
                  {editable ? (
                    <>
                      <span>
                        <PencilIcon
                          style={{ color: "green" }}
                          onClick={() => handleCommentEdit()}
                        />
                      </span>
                      <span>
                        <PencilIcon
                          style={{ color: "red" }}
                          onClick={() => toggleCommentEdit()}
                        />
                      </span>
                    </>
                  ) : (
                    <span>
                      <PencilIcon onClick={() => toggleCommentEdit()} />
                    </span>
                  )}
                  &nbsp;
                  <span>
                    <DeleteIcon
                      onClick={() => handleCommentDelete(comment.commentId)}
                    />
                  </span>
                </>
              )}
            </S.CommentEditButtons>
          </S.CommentContentContainer>
        </S.CommentBody>
      </S.CommentItem>
    </>
  );
}

const S = {
  CommentItem: styled.div`
    display: flex;
    font-size: 0.9em;
    margin-top: 5px;
  `,

  CommentBody: styled.div`
    width: 90%;
    margin-left: 8px;
  `,

  CommentContentContainer: styled.div`
    display: flex;
    gap: 10px;
  `,

  CommentContent: styled.div`
    width: 100%;
  `,

  CommentArea: styled.div`
    width: 100%;
    overflow-wrap: break-word;
  `,

  NickNameLabel: styled.div`
    cursor: pointer;
    color: #aaa;
    font-size: 0.9em;
  `,

  CommentEditButtons: styled.div`
    min-width: 40px;
    > * {
      opacity: 0.5;

      &:hover {
        opacity: 1;
        cursor: pointer;
      }
    }
  `,

  CommentEditArea: styled.textarea`
    -webkit-appearance: none;
    -ms-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background: #303030;
    border-radius: 3px;
    outline: none;
    font-size: 14px;
    width: 100%;
    height: auto;
    max-height: 100px;
    align: top !important;
    justify-content: start;
    align-item: start;
    padding: 5px;
    color: #f2f2f2;
    overflow: scroll;
    resize: none;

    &::-webkit-scrollbar {
      width: 8px;
      background-color: rgba(0 0 0 0);
    }

    &::-webkit-scrollbar-corner {
      display: none;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 30px;
      background-color: gray;
    }

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
};
export default Comment;
