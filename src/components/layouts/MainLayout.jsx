import React from "react";
import { Outlet } from "react-router-dom";
import { Layout } from "antd";
import Sidebar from "../Sidebar";
import Header from "../Header";

const { Sider, Content } = Layout;

const MainLayout = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar bên trái */}
      <Sider
        width={300}
        style={{
          background: "#fff",
          borderRight: "1px solid #f0f0f0",
        }}
      >
        <Sidebar />
      </Sider>

      {/* Khu vực bên phải */}
      <Layout style={{ flex: 1, minWidth: "1200px", width: "calc(100% - 300px)" }}>
        {/* Header phía trên */}
        <Layout.Header
          style={{
            background: "#fff",
            padding: 0,
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <Header />
        </Layout.Header>

        {/* Nội dung chính */}
        <Content
          style={{
            background: "#f9fafb",
            minHeight: "calc(100vh - 64px)", 
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
