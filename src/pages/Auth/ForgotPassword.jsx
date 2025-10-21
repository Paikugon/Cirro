import React, { useContext } from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const ForgotPassword = () => {
  const [form] = Form.useForm();
  const { forgotPassword } = useContext(AuthContext);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      await forgotPassword(values.email);
      localStorage.setItem("resetEmail", values.email); // Lưu email vào localStorage
      messageApi.success({
        content: "Mã OTP đã được gửi đến email của bạn!",
        duration: 2,
      });
      form.resetFields();
      setTimeout(() => {
        navigate("/otp");
      }, 2000);
    } catch (error) {
      messageApi.error({
        content: error.message || "Email không tồn tại hoặc không hợp lệ!",
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
          <Title level={3}>Quên Mật Khẩu</Title>
          <Text type="secondary">Nhập email để nhận mã OTP</Text>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
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

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              style={{ borderRadius: 8 }}
            >
              Gửi Mã OTP
            </Button>
          </Form.Item>

          <Text type="secondary">
            Quay lại{" "}
            <a href="/login" style={{ color: "#1677ff" }}>
              Đăng nhập
            </a>
          </Text>
        </Form>
      </Card>
    </div>
  );
};

export default ForgotPassword;