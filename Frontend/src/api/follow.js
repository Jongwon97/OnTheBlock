import { client, clientWithToken } from "./client";

const followURL = 'follow/';

export const getFollower=()=>{
    return clientWithToken().get(followURL + 'member/follower/check');
}

export const getFollowing=()=>{
    return clientWithToken().get(followURL + 'member/following/check');
}
