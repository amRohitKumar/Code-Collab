import { create } from "zustand";

export type ModalType = "createCodeBox" | "joinCodeBox" | "showCodeBox";

interface IModalStore {
  type: ModalType | null;
  isOpen: boolean;
  // data?: IModalData;
  onOpen: (type: ModalType) => void;
  onClose: () => void;
}

export const useModal = create<IModalStore>((set) => ({
  type: null,
  isOpen: false,
  data: {},
  onOpen: (type) => set({ type, isOpen: true }),
  onClose: () => set({ type: null, isOpen: false }),
}));
