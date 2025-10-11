import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar";
import Header from "../Header";

const MainLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleToggleSidebar = (collapsed) => {
    setSidebarCollapsed(collapsed);
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        width: "100%",
        overflowX: "hidden",
      }}
    >
      {/* Sidebar */}
      <Sidebar collapsed={sidebarCollapsed} onToggle={handleToggleSidebar} />

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          marginLeft: sidebarCollapsed ? "80px" : "290px",
          display: "flex",
          flexDirection: "column",
          transition: "margin-left 0.2s ease",
          width: "100%",
        }}
      >
        <Header />
        <div
          style={{
            padding: "2px 4px", 
            flex: 1,
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
