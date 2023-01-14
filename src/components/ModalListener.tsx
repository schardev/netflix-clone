import { AnimatePresence } from "framer-motion";
import { useModalData } from "../contexts/ModalContext";
import GenresModal from "../pages/GenresModal";
import MobileInfoModal from "./MobileInfoModal";

const ModalListener = () => {
  const modalData = useModalData();
  let outlet: JSX.Element | null = null;

  if (!modalData.visible) {
    outlet = null;
  } else {
    switch (modalData.category) {
      case "list":
        outlet = <GenresModal />;
        break;
      case "tv":
      case "movie":
        outlet = (
          <MobileInfoModal category={modalData.category} id={modalData.id} />
        );
        break;
      default:
        console.error(`Unknown modal type:`, modalData);
        outlet = null;
    }
  }

  return <AnimatePresence>{outlet}</AnimatePresence>;
};

export default ModalListener;
