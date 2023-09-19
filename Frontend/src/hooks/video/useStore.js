import { create } from "zustand";

export const videoModalState = create((set) => ({
  isVideoModalOpen: false,
  setIsVideoModalOpen: () =>
    set((state) => ({ isVideoModalOpen: !state.isVideoModalOpen })),
}));
