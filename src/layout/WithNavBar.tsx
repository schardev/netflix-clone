import { Outlet } from "react-router-dom";
import MobileNav from "../components/MobileNav";
import useMediaQuery from "../hooks/useMediaQuery";

const WithNavBar = () => {
  const matches = useMediaQuery("tablet-up");
  return (
    <>
      <Outlet />
      {!matches && <MobileNav />}
    </>
  );
};

export default WithNavBar;
