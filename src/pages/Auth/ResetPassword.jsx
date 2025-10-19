import React, { useContext } from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const ResetPassword = () => {
  const [form] = Form.useForm();
  const { resetPassword } = useContext(AuthContext);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  // Lấy email và OTP từ localStorage
  const initialEmail = localStorage.getItem("resetEmail") || "";
  const initialOtp = localStorage.getItem("resetOtp") || "";

  const handleSubmit = async (values) => {
    try {
      // Gửi OTP từ localStorage
      await resetPassword(values.email, initialOtp, values.newPassword);
      messageApi.success({
        content: "Đặt lại mật khẩu thành công! Vui lòng đăng nhập.",
        duration: 2,
      });
      // Xóa email và OTP khỏi localStorage
      localStorage.removeItem("resetEmail");
      localStorage.removeItem("resetOtp");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      messageApi.error({
        content: error.message || "Mã OTP hoặc email không hợp lệ!",
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
          <Title level={3}>Đặt Lại Mật Khẩu</Title>
          <Text type="secondary">Nhập thông tin để đặt lại mật khẩu</Text>
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
            name="newPassword"
            label="Mật khẩu mới"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Nhập mật khẩu mới"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Mật khẩu xác nhận không khớp!"));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Xác nhận mật khẩu"
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
              Đặt Lại Mật Khẩu
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

export default ResetPassword;