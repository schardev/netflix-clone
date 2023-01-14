import {
  createContext,
  PropsWithChildren,
  useContext,
  useLayoutEffect,
  useState,
} from "react";

type DeviceContext = "mobile" | "desktop";

export const DeviceContext = createContext<DeviceContext>("mobile");
export const useDeviceContext = () => useContext(DeviceContext);

export const DeviceContextProvider = ({ children }: PropsWithChildren) => {
  const [device, setDevice] = useState<DeviceContext>("mobile");

  const handleResize = () => {
    if (window.matchMedia("(max-width: 650px)").matches) {
      setDevice("mobile");
    } else {
      setDevice("desktop");
    }
  };

  useLayoutEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  });

  // TEMP TODO: remove after completing desktop version
  if (device === "desktop") {
    return <h2>Plox use mobile version huehuehuehue</h2>;
  }

  return (
    <DeviceContext.Provider value={device}>{children}</DeviceContext.Provider>
  );
};

export default DeviceContextProvider;
