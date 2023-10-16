import { client, clientWithToken } from "./client";

const VideoURL = "/videos";

// VideoDetail 조회
export const getVideo = (videoId) => {
  return clientWithToken().get( VideoURL + "/" + videoId +"/detail/check");
};

// 최신 업로드된 영상 리스트 조회
export const getLatestVideoList = () => {
  return client().get(VideoURL + "/latest");
};

// 사용자가 업로드한 영상 리스트 조회
export const getMyUploadVideos = (memberId) => {
  return client().get(`${VideoURL}/${memberId}/upload`);
};

// 사용자가 좋아요 클릭한 영상 리스트 조회
export const getLikeVideos = () => {
  return clientWithToken().get(VideoURL + "/like/check");
};

// 사용자가 시청한 영상 리스트 조회
export const getWatchVideos = () => {
  return clientWithToken().get(VideoURL + "/watch/check");
};

// 사용자가 follow한 유저의 최신 업로드 Video 리스트 조회
export const getFollowVideos = () => {
  return clientWithToken().get(VideoURL + "/follow/check");
};

// 추천 Video 리스트 조회
export const getRecommendVideos = () => {
  return clientWithToken().get(VideoURL + "/recommend/check");
};

// 영상 제목으로 영상 리스트 검색
export const getSearchVideosByKeyword = (keyword) => {
  return client().get( `${VideoURL}/search?keyword=${keyword}`);
};

// 영상 제목으로 합주 가능한 영상 리스트 검색
export const getSearchVideosByKeywordForCompose = (keyword) => {
  return client().get( `${VideoURL}/search/compose?keyword=${keyword}`);
}

// Video 등록
export const registComment = async (commentRequest) => {
  return clientWithToken()
    .post(VideoURL + "/comments/check", commentRequest)
    .then((response)=>{
      return response;
    })
    .catch((error) => {
      alert(error);
      return null;
    });
}

// Video 삭제
export const videoRemove = async (video_id) => {
  return clientWithToken().delete(`${VideoURL}/${video_id}/delete/check`);
};

export const like = async (video_id) => {
  return clientWithToken()
    .post(`${VideoURL}/like/${video_id}/check`);
}

export const likeCancel = async (video_id) => {
  return clientWithToken()
    .delete(`${VideoURL}/like/${video_id}/check`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      alert(error);
      return null;
    });
}

export const commentUpdate = async (videoData) => {
  return clientWithToken()
    .put(`${VideoURL}/comments/check`, videoData)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      alert(error);
      return null;
    });
};

export const commentRemove = async (video_id) => {
  return clientWithToken()
    .delete(`${VideoURL}/comments/${video_id}/check`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      alert(error);
      return null;
    });
};
