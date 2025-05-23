import { create } from "zustand";

interface OffersInboxModalStore {
  isOpen: boolean;
  preSelectedPropertyId?: string;
  onOpen: (preSelectedPropertyId?: string) => void;
  onClose: () => void;
}

export const useOffersInboxModal = create<OffersInboxModalStore>((set) => ({
  isOpen: false,
  preSelectedPropertyId: undefined,
  onOpen: (preSelectedPropertyId?: string) => set({ isOpen: true, preSelectedPropertyId }),
  onClose: () => set({ isOpen: false, preSelectedPropertyId: undefined }),
}));