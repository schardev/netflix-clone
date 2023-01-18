import { useRef } from "react";
import { Outlet } from "react-router-dom";
import ModalListener from "../components/ModalListener";
import { ModalCategory, useModalDispatcher } from "../contexts/ModalContext";

const WithModalListener = () => {
  const setModalData = useModalDispatcher();
  const timerIdRef = useRef<number>();

  const handleCardClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const target = (e.target as HTMLElement).closest(
      "[data-item-id]"
    ) as HTMLElement;

    // Dispatch modal if clicked on a 'movie' or 'tv' card
    if (
      target &&
      target.dataset.itemId &&
      target.dataset.itemCategory !== "person"
    ) {
      const category = target.dataset.itemCategory as ModalCategory;
      const id = +target.dataset.itemId;
      setModalData({
        visible: true,
        category,
        id,
      });
    }
  };

  return (
    <div className="modal-listner" onClick={handleCardClick}>
      <Outlet />
      <ModalListener />
    </div>
  );
};

export default WithModalListener;
