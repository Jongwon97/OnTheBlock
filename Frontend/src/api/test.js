import { client, clientWithToken } from "./client";

const MemberURL = 'member/';

export const getProfileInfo = () => {
    return clientWithToken().get(MemberURL + 'check');
  };

