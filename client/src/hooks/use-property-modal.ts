import { create } from 'zustand';

interface PropertyModalStore {
  isOpen: boolean;
  propertyId?: string;
  onOpen: (propertyId?: string) => void;
  onClose: () => void;
}

export const usePropertyModal = create<PropertyModalStore>((set) => ({
  isOpen: false,
  propertyId: undefined,
  onOpen: (propertyId) => set({ isOpen: true, propertyId }),
  onClose: () => set({ isOpen: false }),
}));