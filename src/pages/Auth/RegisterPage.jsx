import React, { useContext } from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";
import { AuthContext } from "../../context/AuthContext";

const { Title, Text } = Typography;

const RegisterPage = () => {
  const [form] = Form.useForm();
  const { registerUser } = useContext(AuthContext);
  const [messageApi, contextHolder] = message.useMessage(); 

  const handleRegister = async (values) => {
    try {
      const response = await registerUser(values.username, values.password, values.email);

      messageApi.success({
        content: response.message || " Đăng ký thành công!",
        duration: 2.5,
      });

      form.resetFields();

      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);

    } catch (error) {
      console.error(" Lỗi đăng ký:", error);

      messageApi.error({
        content: error.message || "Đăng ký thất bại, vui lòng thử lại!",
        duration: 3,
      });
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f0faff, #fdfdfe)",
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
          <Title level={3}>Đăng ký tài khoản</Title>
          <Text type="secondary">Tạo tài khoản mới để bắt đầu</Text>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleRegister}
          requiredMark={false}
        >
          <Form.Item
            name="username"
            label="Tên đăng nhập"
            rules={[
              { required: true, message: "Vui lòng nhập tên đăng nhập" },
              { min: 4, message: "Tên đăng nhập phải có ít nhất 4 ký tự" },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Nhập tên đăng nhập"
              size="large"
            />
          </Form.Item>

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
              placeholder="Nhập email"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Nhập mật khẩu"
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
              Đăng ký
            </Button>
          </Form.Item>

          <Text type="secondary">
            Đã có tài khoản?{" "}
            <a href="/login" style={{ color: "#1677ff" }}>
              Đăng nhập
            </a>
          </Text>
        </Form>
      </Card>
    </div>
  );
};

export default RegisterPage;
