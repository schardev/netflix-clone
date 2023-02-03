import { useRef } from "react";
import { Outlet } from "react-router-dom";
import ModalListener from "../components/ModalListener";
import { useModalDispatcher } from "../contexts/ModalContext";
import type { MediaType } from "../types/app";

const WithModalListener = () => {
  const setModalData = useModalDispatcher();
  const timerIdRef = useRef<number>();

  const handleCardClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const target = (e.target as HTMLElement).closest(
      "[data-card-id]"
    ) as HTMLElement;
    const cardId = target.dataset.cardId;
    const mediaType = target.dataset.cardMediaType as MediaType;

    // Dispatch modal if clicked on a 'movie' or 'tv' card
    if (cardId && mediaType !== "person") {
      setModalData({
        visible: true,
        category: mediaType,
        id: +cardId,
      });
    }
  };

  const handleHover: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (timerIdRef.current) {
      clearTimeout(timerIdRef.current);
    }

    const target = (e.target as HTMLElement).closest(
      "[data-card-id]"
    ) as HTMLElement;
    const cardId = target.dataset.cardId;
    const mediaType = target.dataset.cardMediaType as MediaType;

    if (cardId && mediaType !== "person") {
      const pos = target.getBoundingClientRect();
      const x = window.scrollX + pos.x - pos.width / 2;
      const y = window.scrollY + pos.y - pos.height / 2;
      timerIdRef.current = setTimeout(() => {
        // if the card is way above the viewport, don't show modal
        if (pos.y < 0) return;

        setModalData({
          visible: true,
          category: mediaType,
          id: +cardId,
          x: x < 0 ? window.scrollX + pos.x : x, // avoid negative start position
          y: y,
        });
      }, 500);
    }
  };

  return (
    <div
      className="modal-listener"
      onClick={handleCardClick}
      onPointerOver={handleHover}>
      <Outlet />
      <ModalListener />
    </div>
  );
};

export default WithModalListener;
