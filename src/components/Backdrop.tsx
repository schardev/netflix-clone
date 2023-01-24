import { motion } from "framer-motion";
import type { MouseEventHandler, PropsWithChildren } from "react";
import { useEffect } from "react";
import { j } from "../utils";

const Backdrop = ({
  preventScroll = true,
  onClick,
  className,
  children,
}: PropsWithChildren<{
  preventScroll?: boolean;
  className?: string;
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
      className={j(className, "backdrop")}
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
