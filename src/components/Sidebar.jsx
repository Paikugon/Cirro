import React from "react";
import { Layout, Menu } from "antd";
import {
  HomeOutlined,
  DashboardOutlined,
  FolderOutlined,
  ShareAltOutlined,
  TeamOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import logo from "../assets/images/logo.jpg";
import { Link, useLocation } from "react-router-dom";

const { Sider } = Layout;

const items = [
  { key: "1", icon: <HomeOutlined />, label: <Link to="/">Trang chủ</Link>, to: "/" },
  { key: "2", icon: <DashboardOutlined />, label: <Link to="/dashboard">DashBoard</Link>, to: "/dashboard" },
  { key: "3", icon: <FolderOutlined />, label: <Link to="/folder">Folder</Link>, to: "/folder" },
  { key: "4", icon: <ShareAltOutlined />, label: <Link to="/share">Quản lý Share</Link>, to: "/share" },
  { key: "5", icon: <TeamOutlined />, label: <Link to="/permission/shared">Được Share</Link>, to: "/permission/shared" },
  { key: "6", icon: <QuestionCircleOutlined />, label: <Link to="/help">Trợ giúp</Link>, to: "/help" },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <Sider
      width={290}
      style={{
        height: "100vh",
        background: "#fff",
        borderRight: "1px solid #eee",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 100,
      }}
    >
      {/* Logo */}
      <div
        style={{
          height: 64,
          boxShadow: "0 1px 4px rgba(0, 21, 41, 0.08)",
          borderBottom: "1px solid #e8e8e8",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fff",
        }}
      >
        <img
          src={logo}
          alt="Logo"
          style={{
            height: 40,
            objectFit: "contain",
          }}
        />
      </div>

      {/* Menu */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          padding: "8px 0",
        }}
      >
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={
            location.pathname === "/"
              ? ["1"]
              : [
                  items.find(
                    (item) =>
                      item.to === location.pathname ||
                      item.children?.find((child) => child.to === location.pathname)
                  )?.key,
                ]
          }
          items={items}
          style={{ borderRight: 0 }}
        />
      </div>
    </Sider>
  );
};

export default Sidebar;
