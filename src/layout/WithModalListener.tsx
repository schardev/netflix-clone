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

  const handleHover: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (timerIdRef.current) {
      clearTimeout(timerIdRef.current);
    }

    const target = (e.target as HTMLElement).closest(
      "[data-item-id]"
    ) as HTMLElement;

    if (
      target &&
      target.dataset.itemId &&
      target.dataset.itemCategory !== "person"
    ) {
      const category = target.dataset.itemCategory as ModalCategory;
      const id = +target.dataset.itemId;
      const pos = target.getBoundingClientRect();
      const x = window.scrollX + pos.x - pos.width / 2;
      const y = window.scrollY + pos.y - pos.height / 2;
      timerIdRef.current = setTimeout(() => {
        // if the card is way above the viewport, don't show modal
        if (pos.y < 0) return;

        setModalData({
          visible: true,
          category,
          id,
          x: x < 0 ? window.scrollX + pos.x : x, // avoid negative start position
          y: y,
        });
      }, 500);
    }
  };

  return (
    <div
      className="modal-listner"
      onClick={handleCardClick}
      onPointerOver={handleHover}>
      <Outlet />
      <ModalListener />
    </div>
  );
};

export default WithModalListener;
