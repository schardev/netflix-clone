import { AnimatePresence, motion } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";

const WithLayoutAnimation = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ y: 30, opacity: 0.7 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "tween" }}>
        <Outlet />
      </motion.div>
    </AnimatePresence>
  );
};

export default WithLayoutAnimation;
