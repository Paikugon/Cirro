import React, { useContext } from "react";
import { Input, Button, Avatar, Spin, message } from "antd";
import { SearchOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Header = () => {
  const navigate = useNavigate();
  const { user, logout, loading } = useContext(AuthContext);
  const [messageApi, contextHolder] = message.useMessage();

  const getUserInitial = (name) => {
    if (!name) return "";
    const words = name.trim().split(" ");
    return words[words.length - 1][0]?.toUpperCase() || name[0]?.toUpperCase();
  };

  // Hàm gọi logout và show message
  const handleLogout = () => {
    logout();
    messageApi.success({
      content: "Đăng xuất thành công!",
      duration: 2,
    });
  };

  return (
    <div
      style={{
        height: "64px",
        background: "#fff",
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid #eee",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      {contextHolder}
      <Input
        placeholder="Search"
        prefix={<SearchOutlined />}
        style={{ borderRadius: "4px", marginRight: "16px" }}
      />

      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {loading ? (
          <Spin size="small" />
        ) : !user ? (
          <Button
            icon={<UserOutlined />}
            style={{ borderRadius: "4px" }}
            type="primary"
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Avatar
              style={{
                backgroundColor: "#1677ff",
                color: "#fff",
                fontWeight: "bold",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              {getUserInitial(user.username)}
            </Avatar>
            <Button onClick={handleLogout}>Logout</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;