import { client,clientWithToken } from "./client";

const NoticeURL = 'notice/';

export const getNotices = () => {
    return clientWithToken().get(NoticeURL + 'member/check');
};

export const deleteNotice =(noticeId)=>{
    return clientWithToken().delete(NoticeURL + 'member/' + noticeId + '/check', noticeId);
};

