import React, { useState } from "react";
import { Dropdown, Menu, Tabs, Table } from "antd";
import {
  UploadOutlined,
  PlusOutlined,
  FolderAddOutlined,
  FileTextOutlined,
  FilePptOutlined,
  FileExcelOutlined,
  GlobalOutlined,
  EditOutlined,
  FormOutlined,
  GoogleOutlined,
  InboxOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import CreateFolderModal from "../Folder/CreateFolderModal"; 

const { TabPane } = Tabs;

const Dashboard = () => {
  const [activeAction, setActiveAction] = useState("upload");
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);


  const actions = [
    { key: "upload", icon: <UploadOutlined />, label: "Tải lên" },
    { key: "create", icon: <PlusOutlined />, label: "Tạo mới" },
    { key: "newFolder", icon: <FolderAddOutlined />, label: "Tạo mới thư mục" },
    { key: "share", icon: <ShareAltOutlined />, label: "Chia sẻ" },
  ];


  const fileData = [
    {
      key: "1",
      name: "vite.svg",
      access: "Chỉ mình bạn",
      modified: "30/09/2025 20:08",
    },
  ];

  const fileColumns = [
    { title: "Tên", dataIndex: "name", key: "name" },
    { title: "Ai có thể truy cập", dataIndex: "access", key: "access" },
    { title: "Chỉnh sửa lần cuối", dataIndex: "modified", key: "modified" },
  ];


  const createMenu = (
    <Menu
      onClick={({ key }) => {
        if (key === "folder") setIsFolderModalOpen(true);
      }}
      items={[
        {
          type: "group",
          label: "Tạo mới",
          children: [
            { key: "folder", icon: <FolderAddOutlined />, label: "Thư mục" },
            { key: "doc", icon: <FileTextOutlined />, label: "Tài liệu" },
            { key: "ppt", icon: <FilePptOutlined />, label: "Trình chiếu" },
            { key: "sheet", icon: <FileExcelOutlined />, label: "Bảng tính" },
            { key: "web", icon: <GlobalOutlined />, label: "Liên kết web" },
          ],
        },
        {
          type: "group",
          label: "Thêm",
          children: [
            { key: "upload", icon: <UploadOutlined />, label: "Tải lên" },
            {
              key: "request",
              icon: <InboxOutlined />,
              label: "Yêu cầu tệp tin",
            },
            {
              key: "import",
              icon: <GoogleOutlined />,
              label: "Nhập từ Google Drive",
            },
          ],
        },
        {
          type: "group",
          label: "Chỉnh sửa",
          children: [
            { key: "edit", icon: <EditOutlined />, label: "Sửa" },
            { key: "sign", icon: <FormOutlined />, label: "Ký tên" },
          ],
        },
      ]}
    />
  );

  const actionCardStyle = (active, key) => ({
    width: 130,
    height: 90,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 10,
    border: "1px solid #d9d9d9",
    cursor: "pointer",
    transition: "all 0.2s",
    background: active === key ? "#2f2f2f" : "#fff",
    color: active === key ? "#fff" : "#000",
    fontWeight: 500,
  });

  return (
    <div style={{ padding: 24 }}>
      {/*  Thanh */}
      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 24,
          flexWrap: "wrap",
        }}
      >
        {actions.map((action) =>
          action.key === "create" ? (
            <Dropdown
              overlay={createMenu}
              trigger={["click"]}
              key={action.key}
              placement="bottomLeft"
            >
              <div
                onClick={() => setActiveAction(action.key)}
                style={actionCardStyle(activeAction, action.key)}
              >
                <div style={{ fontSize: 22 }}>{action.icon}</div>
                <div style={{ fontSize: 14 }}>{action.label}</div>
              </div>
            </Dropdown>
          ) : (
            <div
              key={action.key}
              onClick={() => setActiveAction(action.key)}
              style={actionCardStyle(activeAction, action.key)}
            >
              <div style={{ fontSize: 22 }}>{action.icon}</div>
              <div style={{ fontSize: 14 }}>{action.label}</div>
            </div>
          )
        )}
      </div>

      {/*  Tabs */}
      <Tabs defaultActiveKey="1">
        <TabPane tab="Tất cả tệp" key="1">
          <Table dataSource={fileData} columns={fileColumns} />
        </TabPane>
        <TabPane tab="Gần đây" key="2">
          <p>Chưa có tệp gần đây</p>
        </TabPane>
        <TabPane tab="Đánh dấu sao" key="3">
          <p>Chưa có tệp được đánh dấu sao</p>
        </TabPane>
      </Tabs>

      {/*  Modal*/}
      <CreateFolderModal
        open={isFolderModalOpen}
        onCancel={() => setIsFolderModalOpen(false)}
        onCreate={(data) => {
          console.log(" Thư mục mới:", data);
          setIsFolderModalOpen(false);
        }}
      />
    </div>
  );
};

export default Dashboard;
