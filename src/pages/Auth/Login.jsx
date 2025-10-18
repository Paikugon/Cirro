import React, { useContext } from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { AuthContext } from "../../context/AuthContext";

const { Title, Text } = Typography;

const Login = () => {
  const [form] = Form.useForm();
  const { loginUser } = useContext(AuthContext);
  const [messageApi, contextHolder] = message.useMessage();

  const handleSubmit = async (values) => {
    try {
      await loginUser(values.username, values.password);
      messageApi.success({
        content: " Đăng nhập thành công!",
        duration: 2,
      });
    } catch (error) {
      messageApi.error({
        content: error.message || " Sai tên đăng nhập hoặc mật khẩu!",
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
          <Title level={3}>Đăng nhập</Title>
          <Text type="secondary">Nhập thông tin để đăng nhập</Text>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
        >
          <Form.Item
            name="username"
            label="Tên đăng nhập"
            rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập" }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Nhập tên đăng nhập"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
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
              Đăng nhập
            </Button>
          </Form.Item>

          <Text type="secondary">
            Chưa có tài khoản?{" "}
            <a href="/register" style={{ color: "#1677ff" }}>
              Đăng ký
            </a>
          </Text>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
