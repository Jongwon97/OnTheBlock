import { client, clientWithToken } from "./client";

const VideoURL = "/videos";

export const getVideo = (videoId) => {
  return clientWithToken().get( VideoURL + "/" + videoId );
};
