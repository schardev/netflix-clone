import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState,
} from "react";

export type ModalCategory = Exclude<Category, "person"> | "list";
export type ModalData =
  | {
      visible: false;
    }
  | {
      visible: true;
      category: ModalCategory;
      id: number;
      x?: number;
      y?: number;
    }
  | { visible: true; category: "list" }
  | null;

export const ModalData = createContext<ModalData>(null);

export const ModalDispatch = createContext<Dispatch<
  SetStateAction<ModalData>
> | null>(null);

export const useModalData = () => {
  const modalData = useContext(ModalData);
  if (!modalData) {
    throw new Error("useModalData must be used within ModalData Provider");
  }
  return modalData;
};

export const useModalDispatcher = () => {
  const dispatch = useContext(ModalDispatch);
  if (!dispatch) {
    throw new Error(
      "useModalDispatcher must be used within ModalDispatch Provider"
    );
  }
  return dispatch;
};

export const ModalProvider = ({ children }: PropsWithChildren) => {
  const [modaldata, setModalData] = useState<ModalData>({ visible: false });

  return (
    <ModalData.Provider value={modaldata}>
      <ModalDispatch.Provider value={setModalData}>
        {children}
      </ModalDispatch.Provider>
    </ModalData.Provider>
  );
};
