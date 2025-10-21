import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Layout } from "antd";
import Sidebar from "../Sidebar";
import Header from "../Header";

const { Sider, Content } = Layout;

// Các route cần ẩn sidebar
const AUTH_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/otp"
];

const MainLayout = () => {
  const location = useLocation();
  const isAuthPage = AUTH_ROUTES.some((route) =>
    location.pathname.startsWith(route)
  );

  if (isAuthPage) {
    // Không render sidebar và header cho các trang auth
    return (
      <Layout style={{ minHeight: "100vh", background: "#f9fafb" }}>
        <Content
          style={{
            background: "#f9fafb",
            minHeight: 0,
            overflowY: "auto",
            width: "100vw",
            height: "100vh",
            padding: 0,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    );
  }

  // Trang bình thường (có sidebar + header)
  return (
    <Layout style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh" }}>
      {/* Sidebar bên trái */}
      <Sider
        width={300}
        style={{
          background: "#fff",
          borderRight: "1px solid #f0f0f0",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100,
        }}
      >
        <Sidebar />
      </Sider>

      {/* Khu vực bên phải */}
      <Layout
        style={{
          marginLeft: 300,
          height: "100vh",
          width: "calc(100vw - 300px)",
          background: "#f9fafb",
        }}
      >
        {/* Header phía trên */}
        <Layout.Header
          style={{
            background: "#fff",
            padding: 0,
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
            position: "sticky",
            top: 0,
            zIndex: 101,
            width: "100%",
          }}
        >
          <Header />
        </Layout.Header>

        {/* Nội dung chính */}
        <Content
          style={{
            background: "#f9fafb",
            height: "calc(100vh - 64px)",
            minHeight: 0,
            overflowY: "auto",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
