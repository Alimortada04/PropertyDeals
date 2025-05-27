import { create } from "zustand";

interface MarketingCenterModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useMarketingCenterModal = create<MarketingCenterModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));