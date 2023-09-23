import { client,clientWithToken } from "./client";

const NoticeURL = 'notice/';

export const getNotices = () => {
    return clientWithToken().get(NoticeURL + 'check');
};

export const deleteNotice =(noticeId)=>{
    return clientWithToken().delete(NoticeURL + noticeId + '/check', noticeId);
};

