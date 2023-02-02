import { PropsWithChildren, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const Portal = ({ children }: PropsWithChildren) => {
  const portalRoot = document.querySelector("#portal-root") as HTMLDivElement;

  // using ref here to avoid creating a new div every time portal renders,
  // this also avoids triggering framer animations on state change outside portal
  const containerDiv = useRef(document.createElement("div"));

  useEffect(() => {
    portalRoot.appendChild(containerDiv.current);
    return () => {
      portalRoot.removeChild(containerDiv.current);
    };
  });

  return createPortal(children, containerDiv.current);
};

export default Portal;
