import { create } from "zustand";

export type ModalType = "createCodeBox" | "joinCodeBox" | "shareCodeBox";

interface IModalStore {
  type: ModalType | null;
  isOpen: boolean;
  data: any;
  onOpen: (type: ModalType, data?: any) => void;
  onClose: () => void;
}

export const useModal = create<IModalStore>((set) => ({
  type: null,
  isOpen: false,
  data: {},
  onOpen: (type, data = {}) => set({ type, data, isOpen: true }),
  onClose: () => set({ type: null, isOpen: false }),
}));
