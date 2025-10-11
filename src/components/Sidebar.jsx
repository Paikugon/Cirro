import React from "react";
import { Layout, Menu, Badge } from "antd";
import {
  HomeOutlined,
  FolderOpenOutlined,
  BellOutlined,
  AppstoreOutlined,
  DesktopOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;

const Sidebar = () => {
  return (
    <Sider
      width={80}
      style={{
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        background: "#f9f7f4",
        borderRight: "1px solid #eee",
      }}
    >
      {/* Logo placeholder */}
      <div
        style={{
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            background: "black",
            borderRadius: 4,
          }}
        />
      </div>

      {/* Menu items */}
      <Menu
        mode="inline"
        defaultSelectedKeys={["home"]}
        style={{
          background: "transparent",
          border: "none",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          marginTop: 12,
        }}
        items={[
          {
            key: "home",
            icon: <HomeOutlined style={{ fontSize: 20 }} />,
            label: "Home",
          },
          {
            key: "folders",
            icon: <FolderOpenOutlined style={{ fontSize: 20 }} />,
            label: "Folders",
          },
          {
            key: "activity",
            icon: (
              <Badge count={4} size="small" color="#c01b47">
                <BellOutlined style={{ fontSize: 20 }} />
              </Badge>
            ),
            label: "Activity",
          },
          {
            key: "more",
            icon: <AppstoreOutlined style={{ fontSize: 20 }} />,
            label: "More",
          },
        ]}
      />

      {/* Bottom section */}
      <div
        style={{
          position: "absolute",
          bottom: 20,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
        }}
      >
        <DesktopOutlined style={{ fontSize: 20, color: "#6e6e6e" }} />
        <Badge dot color="#c01b47">
          <QuestionCircleOutlined style={{ fontSize: 20, color: "#6e6e6e" }} />
        </Badge>
      </div>
    </Sider>
  );
};

export default Sidebar;