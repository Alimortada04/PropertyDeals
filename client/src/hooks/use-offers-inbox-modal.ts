import { create } from "zustand";

interface OffersInboxModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useOffersInboxModal = create<OffersInboxModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));