
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar";
import Header from "../Header";

const MainLayout = () => {
  return (
    <div>
      <Sidebar />
      <div style={{ marginLeft: "80px" }}>
        <Header />
        <div style={{ padding: "24px", minHeight: "calc(100vh - 64px)" }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;