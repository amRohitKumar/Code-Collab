import { create } from "zustand";

export type ModalType = "createCodeBox" | "joinCodeBox" | "shareCodeBox";

interface IModalData {
  [key: string]: any;
}

interface IModalStore {
  type: ModalType | null;
  isOpen: boolean;
  data?: IModalData;
  onOpen: (type: ModalType, data: IModalData) => void;
  onClose: () => void;
}

export const useModal = create<IModalStore>((set) => ({
  type: null,
  isOpen: false,
  data: {},
  onOpen: (type, data) => set({ type, data, isOpen: true }),
  onClose: () => set({ type: null, isOpen: false }),
}));
