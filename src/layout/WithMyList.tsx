import { Outlet } from "react-router-dom";
import MyListProvider from "../contexts/MyListProvider";

const WithMyList = () => {
  return (
    <MyListProvider>
      <Outlet />
    </MyListProvider>
  );
};

export default WithMyList;
