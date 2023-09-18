import { client, clientWithToken } from "./client";

const MemberURL = 'member/';

export const getUserInfo = () => {
    return clientWithToken().get(MemberURL + 'check');
  };

