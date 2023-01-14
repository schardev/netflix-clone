import { motion } from "framer-motion";
import type { MouseEventHandler, PropsWithChildren } from "react";
import { useEffect } from "react";

const Backdrop = ({
  preventScroll = true,
  onClick,
  children,
}: PropsWithChildren<{
  preventScroll?: boolean;
  onClick?: MouseEventHandler<HTMLDivElement>;
}>) => {
  useEffect(() => {
    if (preventScroll) document.body.classList.add("prevent-scroll");

    return () => {
      if (preventScroll) document.body.classList.remove("prevent-scroll");
    };
  });

  return (
    <motion.div
      className="backdrop"
      onClick={onClick}
      initial={{ backgroundColor: "rgba(0,0,0,0)" }}
      animate={{ backgroundColor: "rgba(0,0,0,0.4)" }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}>
      {children}
    </motion.div>
  );
};

export default Backdrop;
