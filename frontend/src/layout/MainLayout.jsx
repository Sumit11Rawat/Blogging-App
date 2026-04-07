import Navbar from "../components/navbar";
import { Outlet } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MainLayout = () => {
  return (
    <div>
      <Navbar />

      <ToastContainer
        position="top-right"
        autoClose={2000}
        theme="dark"
      />

      <Outlet />
    </div>
  );
};

export default MainLayout;