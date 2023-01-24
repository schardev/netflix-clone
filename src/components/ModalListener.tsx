import { AnimatePresence } from "framer-motion";
import { useModalData } from "../contexts/ModalContext";
import useMediaQuery from "../hooks/useMediaQuery";
import GenresModal from "../pages/GenresModal";
import DesktopInfoModal from "./DesktopInfoModal";
import MobileInfoModal from "./MobileInfoModal";

const ModalListener = () => {
  const modalData = useModalData();
  const tabletUp = useMediaQuery("tablet-up");
  let outlet: JSX.Element | null = null;

  if (modalData.visible) {
    switch (modalData.category) {
      case "list":
        outlet = <GenresModal />;
        break;
      case "tv":
      case "movie": {
        if (tabletUp) {
          outlet = (
            <DesktopInfoModal
              category={modalData.category}
              id={modalData.id}
              x={modalData.x!}
              y={modalData.y!}
              expanded={modalData.expanded}
            />
          );
        } else {
          outlet = (
            <MobileInfoModal category={modalData.category} id={modalData.id} />
          );
        }
        break;
      }
      default:
        console.error(`Unknown modal type:`, modalData);
    }
  }

  return <AnimatePresence>{outlet}</AnimatePresence>;
};

export default ModalListener;
