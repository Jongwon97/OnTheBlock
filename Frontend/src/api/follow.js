import { client, clientWithToken } from "./client";

const followURL = 'follow/';

export const getFollower=(memberId)=>{
    return clientWithToken().get(followURL + 'member/follower/check', { params: { memberId } });
}

export const getFollowing=(memberId)=>{
    return clientWithToken().get(followURL + 'member/following/check', { params: { memberId } });
}

export const checkFollow=(followingId)=>{
    return clientWithToken().get(followURL + 'member/' + followingId + '/check', followingId);
}

export const addFollow=(followingId)=>{
    return clientWithToken().post(followURL + 'member/' + followingId + '/check', followingId);
}

export const deleteFollow=(followingId)=>{
    return clientWithToken().delete(followURL + 'member/' + followingId + '/check', followingId);
}
