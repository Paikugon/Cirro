import React from "react";
import { Result, Button } from "antd";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f5f7fa 30%, #c3cfe2 100%)",
      }}
    >
      <Result
        status="404"
        title={
          <span style={{ fontSize: 80, fontWeight: 700, color: "#1677ff" }}>
            404
          </span>
        }
        subTitle={
          <span style={{ fontSize: 18, color: "#666" }}>
            Xin lỗi, trang bạn tìm không tồn tại.
          </span>
        }
        extra={
          <Button
            type="primary"
            size="large"
            style={{
              borderRadius: 8,
              fontWeight: 600,
              boxShadow: "0 2px 8px rgba(22,119,255,0.08)",
            }}
            onClick={() => navigate("/")}
          >
            Quay lại Trang chủ
          </Button>
        }
        style={{
          padding: 0,
          background: "transparent",
          width: 420,
          textAlign: "center",
        }}
      />
    </div>
  );
};

export default NotFoundPage;
