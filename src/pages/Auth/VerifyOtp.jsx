import React, { useContext } from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { MailOutlined, NumberOutlined } from "@ant-design/icons";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const VerifyOtp = () => {
  const [form] = Form.useForm();
  const { verifyOtp } = useContext(AuthContext);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  // Lấy email từ localStorage
  const initialEmail = localStorage.getItem("resetEmail") || "";

  const handleSubmit = async (values) => {
    try {
      await verifyOtp(values.email, values.otp);
      // Lưu email và OTP vào localStorage
      localStorage.setItem("resetEmail", values.email);
      localStorage.setItem("resetOtp", values.otp);
      messageApi.success({
        content: "Xác nhận OTP thành công! Vui lòng đặt lại mật khẩu.",
        duration: 2,
      });
      setTimeout(() => {
        navigate("/reset-password");
      }, 2000);
    } catch (error) {
      messageApi.error({
        content: error.message || "Mã OTP không hợp lệ hoặc đã hết hạn!",
        duration: 2.5,
      });
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e0f7ff, #f5f7fa)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      {contextHolder}
      <Card
        style={{
          maxWidth: 400,
          width: "100%",
          borderRadius: 12,
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Title level={3}>Xác Nhận OTP</Title>
          <Text type="secondary">Nhập email và mã OTP đã nhận</Text>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
          initialValues={{ email: initialEmail }}
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Nhập email của bạn"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="otp"
            label="Mã OTP"
            rules={[{ required: true, message: "Vui lòng nhập mã OTP" }]}
          >
            <Input
              prefix={<NumberOutlined />}
              placeholder="Nhập mã OTP"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              style={{ borderRadius: 8 }}
            >
              Xác Nhận
            </Button>
          </Form.Item>

          <Text type="secondary">
            Quay lại{" "}
            <a href="/forgot-password" style={{ color: "#1677ff" }}>
              Gửi lại OTP
            </a>{" "}
            hoặc{" "}
            <a href="/login" style={{ color: "#1677ff" }}>
              Đăng nhập
            </a>
          </Text>
        </Form>
      </Card>
    </div>
  );
};

export default VerifyOtp;