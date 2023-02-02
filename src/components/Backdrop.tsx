import { HTMLMotionProps, motion } from "framer-motion";
import type { MouseEventHandler, PropsWithChildren } from "react";
import { useEffect } from "react";

type BackdropProps = PropsWithChildren<{
  preventScroll?: boolean;
  className?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
}> &
  HTMLMotionProps<"div">;

const Backdrop = ({
  preventScroll = true,
  onClick,
  className,
  children,
  ...props
}: BackdropProps) => {
  useEffect(() => {
    if (preventScroll) document.body.classList.add("prevent-scroll");

    return () => {
      if (preventScroll) document.body.classList.remove("prevent-scroll");
    };
  });

  return (
    <motion.div
      className={className || "backdrop"}
      onClick={onClick}
      {...props}>
      {children}
    </motion.div>
  );
};

export default Backdrop;
