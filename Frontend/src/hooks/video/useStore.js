import { forEach } from "lodash";
import { create } from "zustand";

export const videoModalState = create((set) => ({
  isVideoModalOpen: false,
  setIsVideoModalOpen: () =>
    set((state) => ({ isVideoModalOpen: !state.isVideoModalOpen })),
}));

export const videoListState = create((set) => ({
  latestVideoList: [],
  setLatestVideoList: (list) =>
    set((state) => ({ latestVideoList: list })),
}));

export const openVideoState = create((set) => ({
  openVideoId: 0,
  openVideoData: {
    videoId: 0,
    name: "비디오 제목 기본값입니다.",
    description: "비디오 설명 기본값입니다.",
    image: "",
    watch: 0,
    created_time: "2023-09-18",
    comments: [],
    sessions: [
      {
        member: {
          memberId: 0,
          nickname: "username000000",
        },
        instrument: "피아노",
        createdTime: "2023-09-30",
        volume: 0,
        startPoint: 0,
        sessionUrl: "",
      },
    ],
    member: {
      member_id: 0,
      nickname: "user0000",
    },
  },

  sessionsMap: new Map(),
  setOpenVideoId: (id) => set(() => ({ openVideoId: id })),
  
  setOpenVideoData: (data) =>
    set((state) => ({
      openVideoData: data,
    })),
  setSessionsMap: (data) =>
    set((state) => ({
      sessionsMap: data,
    })),
}));

export const recordVideoState = create((set) => ({
  data: {
    name: "더미 데이터 제목입니다.",
    description: "더미 데이터 설명입니다.",
    songId: null,
    song: {
      songId: null,
    },
  },

  videoBlobUrl: "",

  thumbnailBlobUrl: "",

  session: {
    memberId: 0,
    instrumentId: 0,
    volume: 0,
    startPoint: 0,
    totalFrame: 0,
    sessionPosition: "BACKGROUND",
    sessionUrl: "https://download.samplelib.com/mp4/sample-5s.mp4",
  },

  origins: [],

  setData: (data) => {
    const newData = {
      name: data.name,
      description: data.description,
      songId: data.songId,
      song: { songId: data.songId },
    };

    const newSession = {
      instrumentId: data.instrumentId,
    };

    set((state) => ({
      data: newData,
      session: newSession,
    }));
  },

  setSession: (session) =>
    set((state) => ({
      session: {
        volume: session.volume,
        startPoint: session.startPoint,
        totalFrame: session.totalFrame,
        sessionPosition: session.sessionPosition,
        sessionUrl: session.sessionUrl,
      },
    })),

  setOrigins: (origins) => {
    set((state) => ({
      origins: [...origins],
    }));
  },

  setVideoBlobUrl: (url) =>
    set((state) => ({
      videoBlobUrl: url,
    })),

  setThumbnailBlobUrl: (url) =>
    set((state) => ({
      thumbnailBlobUrl: url,
    })),
}));
