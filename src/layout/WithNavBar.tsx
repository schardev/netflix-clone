import { Outlet } from "react-router-dom";
import MobileNav from "../components/MobileNav";

const WithNavBar = () => {
  return (
    <>
      <Outlet />
      <MobileNav />
    </>
  );
};

export default WithNavBar;
