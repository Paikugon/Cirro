import React from "react";
import { Input, Button, Avatar } from "antd";
import { SearchOutlined, UserOutlined } from "@ant-design/icons";

const Header = () => {
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
      {/* Search Input */}
      <Input
        placeholder="Search"
        prefix={<SearchOutlined />}
        style={{ width: 1000, borderRadius: "4px" , marginRight: "16px"}}
      />

      {/* Right Section */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <Button icon={<UserOutlined />} style={{ borderRadius: "4px" }}>
          Invite Members
        </Button>

        <Button
          type="primary"
          style={{
            background: "#faad14",
            borderColor: "#faad14",
            borderRadius: "4px",
          }}
        >
          Click to Upgrade
        </Button>

        {/* Avatar */}
        <Avatar
          size="default"
          style={{
            backgroundColor: "#87d068",
            color: "#fff",
            fontWeight: "bold",
          }}
        >
          A
        </Avatar>
      </div>
    </div>
  );
};

export default Header;
