import React from "react";
import { Layout, Typography, Collapse, Input, Card, Row, Col, Divider, Space, Tooltip } from "antd";
import {
  SearchOutlined,
  MailOutlined,
  PhoneOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

const CARD_WIDTH = 800;

const faqList = [
  {
    key: "1",
    question: "Làm thế nào để tạo tài khoản mới?",
    answer:
      "Vào trang đăng ký, điền thông tin cá nhân và xác nhận email để kích hoạt tài khoản.",
  },
  {
    key: "2",
    question: "Tôi quên mật khẩu thì phải làm sao?",
    answer:
      "Chọn “Quên mật khẩu?” trên trang đăng nhập, nhập email và làm theo hướng dẫn để đặt lại mật khẩu.",
  },
  {
    key: "3",
    question: "Làm sao để liên hệ với bộ phận hỗ trợ?",
    answer:
      "Bạn có thể gửi email hoặc gọi điện cho chúng tôi theo thông tin bên dưới.",
  },
];

const HelpPage = () => {
  return (
    <Layout style={{ background: "linear-gradient(120deg, #f7f9fc 60%, #e0ecfc 100%)", minHeight: "100vh" }}>
      <Content
        style={{
          margin: "0 auto",
          padding: "0 12px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "calc(100vh - 80px)",
        }}
      >
        <Card
          bordered={false}
          style={{
            borderRadius: 18,
            boxShadow:
              "0 4px 16px 1.5px rgba(80,80,160,0.11), 0 1px 4px rgba(14,46,100,0.06)",
            padding: 30,
            width: CARD_WIDTH,
            minWidth: CARD_WIDTH,
            maxWidth: CARD_WIDTH,
            display: "flex",
            flexDirection: "column",
            background: "rgba(255,255,255,0.98)",
            justifyContent: "flex-start",
            overflow: "hidden",
          }}
        >
          <Row justify="center" align="middle" style={{ marginBottom: 4 }}>
            <Col>
              <QuestionCircleOutlined
                style={{
                  fontSize: 38,
                  color: "#2C5AA0",
                  borderRadius: "50%",
                  background: "linear-gradient(120deg,#e9f3ff 60%,#f6fafd)",
                  padding: 12,
                  marginBottom: 4,
                  boxShadow: "0 2px 8px rgba(44,80,160,.08)",
                }}
              />
            </Col>
          </Row>
          <Title level={2} style={{ textAlign: "center", marginBottom: 6, color: "#234076" }}>
            Trung tâm Trợ giúp
          </Title>
          <Paragraph
            style={{ textAlign: "center", color: "#788497", marginBottom: 20, fontSize: 16 }}
          >
            Tìm đáp án cho thắc mắc của bạn hoặc liên hệ với đội ngũ hỗ trợ.
          </Paragraph>

          <Title level={4} style={{ margin: "0 0 10px 0", color: "#2a3b5c" }}>Câu hỏi thường gặp</Title>
          <Collapse
            accordion
            style={{ marginBottom: 10, background: "#f9fafc", borderRadius: 10, boxShadow: "0 0 0.5px #e7eaf0" }}
            bordered={false}
            expandIconPosition="right"
          >
            {faqList.map(({ key, question, answer }) => (
              <Panel
                header={
                  <span style={{ fontWeight: 500, fontSize: 15, color: "#355272" }}>
                    {question}
                  </span>
                }
                key={key}
                style={{
                  background: "#f9fafc",
                  borderRadius: 10,
                }}
              >
                <Text style={{ fontSize: 15, color: "#273149" }}>{answer}</Text>
              </Panel>
            ))}
          </Collapse>
          <Divider style={{ margin: "12px 0 14px 0" }}>
            <span style={{ color: "#97abd7", fontSize: 12, letterSpacing: 0.5 }}>HOẶC</span>
          </Divider>
          <Title level={4} style={{ margin: 0, color: "#395689", fontWeight: 600, letterSpacing: 0.3 }}>Liên hệ hỗ trợ</Title>
          <Space direction="vertical" size={4} style={{ marginTop: 8 }}>
            <Paragraph style={{ fontSize: 15, marginBottom: 0, color: "#46639c" }}>
              <Tooltip title="Gửi email cho chúng tôi">
                <MailOutlined style={{ fontSize: 18, color: "#1476e4", marginRight: 8 }} />
              </Tooltip>
              Email:{" "}
              <a
                href="mailto:duyhoanggl98@gmail.com"
                style={{
                  color: "#1575e4",
                  fontWeight: 500,
                  textDecoration: "underline",
                }}
              >
                duyhoanggl98@gmail.com
              </a>
            </Paragraph>
            <Paragraph style={{ fontSize: 15, marginBottom: 0, color: "#46639c" }}>
              <Tooltip title="Gọi hỗ trợ">
                <PhoneOutlined style={{ fontSize: 18, color: "#36b37e", marginRight: 8 }} />
              </Tooltip>
              Điện thoại:{" "}
              <a
                href="tel:0346609715"
                style={{
                  color: "#30865b",
                  fontWeight: 500,
                  textDecoration: "underline",
                }}
              >
                034 6609 715
              </a>
            </Paragraph>
          </Space>
        </Card>
      </Content>
    </Layout>
  );
};

export default HelpPage;
