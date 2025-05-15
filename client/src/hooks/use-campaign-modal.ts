import { create } from 'zustand';

interface CampaignModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useCampaignModal = create<CampaignModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));