import { Outlet } from "react-router-dom";
import Header from "../components/Header";

const WithHeader = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default WithHeader;
