import { client, clientWithToken } from "./client";

const MemberURL = 'member/';

export const getMyUserInfo = () => {
  return clientWithToken().get(MemberURL + 'me/check');
};

export const getUserInfo = (memberId) => {
    return clientWithToken().get(MemberURL + 'check', { params: { memberId } });
};

export const changeUserNickName = (newNickName) => {
  return clientWithToken().post(MemberURL + 'nickname/check', {}, { params: { nickName: newNickName } });
};

export const changeUserDescription = (newDescription) => {
  return clientWithToken().post(MemberURL + 'description/check', {}, { params: { description: newDescription } });
};

// 닉네임 중복 검사
export const checkDuplicateNickname=(nickName)=>{
  return client().get(MemberURL+'nickName', { params: { nickName } });
}

// 닉네임, 관심 악기, 관심 장르 등록
export const registMemberInit=(nickName, selectedInstruments, selectedGenres)=>{
  const memberInitRequest = {
    memberId: localStorage.getItem("memberId"),
    nickName: nickName,
    instruments: selectedInstruments,
    genres: selectedGenres
  };
  return clientWithToken().post(MemberURL+'registInit/check',memberInitRequest);
}