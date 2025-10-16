import React, { useState, useEffect } from "react";
import { Dropdown, Menu, Tabs, Table, message } from "antd";
import {
  UploadOutlined,
  PlusOutlined,
  FolderAddOutlined,
  ShareAltOutlined,
  FileTextOutlined,
  FileExcelOutlined,
  FilePptOutlined,
  GlobalOutlined,
  InboxOutlined,
  GoogleOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import CreateFolderModal from "../Folder/CreateFolderModal";
import { getFilesByUser } from "../../api/fileApi";
import { createFolder, getFoldersByUser } from "../../api/folderApi";
import { useNavigate } from "react-router-dom";

const { TabPane } = Tabs;

const Dashboard = () => {
  const [activeAction, setActiveAction] = useState("upload");
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [items, setItems] = useState([]); // Gộp file và folder
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const userId = "5f7c51d3-a2fa-48df-a2f5-03ea647b2d22";

  // Lấy danh sách thư mục + file của user
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const [folderRes, fileRes] = await Promise.all([
          getFoldersByUser(userId),
          getFilesByUser(userId),
        ]);

        if (folderRes.data.statusCode === 200 && fileRes.data.statusCode === 200) {
          const folders = (folderRes.data.data || []).map((f) => ({
            id: f.folderId,
            name: f.name,
            owner: f.ownerName || "Bạn",
            createdAt: f.createdAt,
            type: "folder",
          }));

          const files = (fileRes.data.data || []).map((f) => ({
            id: f.fileId,
            name: f.name,
            owner: "Bạn",
            createdAt: f.createdAt,
            type: "file",
            url: f.filePath,
          }));

          setItems([...folders, ...files]);
        } else {
          message.warning("Không thể tải dữ liệu người dùng.");
        }
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
        message.error("Không thể tải dữ liệu!");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Hành động
  const actions = [
    { key: "upload", icon: <UploadOutlined />, label: "Tải lên" },
    { key: "create", icon: <PlusOutlined />, label: "Tạo mới" },
    { key: "newFolder", icon: <FolderAddOutlined />, label: "Tạo thư mục" },
    { key: "share", icon: <ShareAltOutlined />, label: "Chia sẻ" },
  ];

  const createMenu = (
    <Menu
      onClick={({ key }) => handleMenuAction({ key })}
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
            { key: "request", icon: <InboxOutlined />, label: "Yêu cầu tệp" },
            { key: "import", icon: <GoogleOutlined />, label: "Nhập từ Google Drive" },
          ],
        },
      ]}
    />
  );

  // Cột bảng hiển thị
  const columns = [
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <a
          onClick={() => {
            if (record.type === "folder") {
              navigate(`/folder/${record.id}`);
            } else {
              window.open(record.url, "_blank");
            }
          }}
        >
          {record.type === "folder" ? "📁 " : "📄 "}
          {text}
        </a>
      ),
    },
    { title: "Chủ sở hữu", dataIndex: "owner", key: "owner" },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (date ? new Date(date).toLocaleDateString("vi-VN") : "--"),
    },
    {
      title: "",
      key: "actions",
      align: "center",
      render: () => <MoreOutlined style={{ fontSize: 18, cursor: "pointer" }} />,
    },
  ];

  const handleMenuAction = async ({ key }) => {
    switch (key) {
      case "folder":
        setIsFolderModalOpen(true);
        break;
      case "upload":
        message.info("Tải lên tệp");
        break;
      default:
        message.info(`Chức năng: ${key}`);
    }
  };

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

 const handleCreateFolder = async ({ folderName }) => {
  try {
    const res = await createFolder({
      name: folderName, // 👈 trùng với API backend
      ownerId: userId,
    });

    if (res.data.statusCode === 200) {
      message.success("Tạo thư mục thành công!");
      setIsFolderModalOpen(false);

      // Cập nhật danh sách hiển thị ngay
      setItems((prev) => [
        {
          id: res.data.data.folderId,
          name: folderName,
          owner: "Bạn",
          createdAt: new Date().toISOString(),
          type: "folder",
        },
        ...prev,
      ]);
    } else {
      message.error(res.data.message || "Tạo thư mục thất bại!");
    }
  } catch (error) {
    message.error("Không thể tạo thư mục!");
    console.error(error);
  }
};

  return (
    <div style={{ padding: 24 }}>
    {/* Thanh hành động */}
<div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
  {actions.map((action) => {
    // Xác định menu tùy theo action
    let menu = null;
    switch (action.key) {
      case "upload":
        menu = (
          <Menu
            onClick={({ key }) => message.info(`Chọn: ${key}`)}
            items={[
              { key: "uploadFile", label: "Tải lên tệp", icon: <UploadOutlined /> },
              { key: "uploadFolder", label: "Tải lên thư mục", icon: <FolderAddOutlined /> },
            ]}
          />
        );
        break;
      case "create":
        menu = createMenu; // menu gốc bạn đã có
        break;
      case "newFolder":
        menu = (
          <Menu
            onClick={({ key }) => {
              if (key === "folderEmpty") setIsFolderModalOpen(true);
              else message.info("Tạo thư mục mẫu");
            }}
            items={[
              { key: "folderEmpty", label: "Thư mục rỗng", icon: <FolderAddOutlined /> },
              { key: "folderTemplate", label: "Thư mục mẫu", icon: <FileTextOutlined /> },
            ]}
          />
        );
        break;
      case "share":
        menu = (
          <Menu
            onClick={({ key }) => message.info(`Chọn chia sẻ: ${key}`)}
            items={[
              { key: "link", label: "Qua liên kết", icon: <GlobalOutlined /> },
              { key: "email", label: "Qua email", icon: <ShareAltOutlined /> },
            ]}
          />
        );
        break;
      default:
        break;
    }

    return (
      <Dropdown
        key={action.key}
        overlay={menu}
        trigger={["click"]}
        placement="bottomLeft"
      >
        <div
          onClick={() => setActiveAction(action.key)}
          style={{
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
            background: activeAction === action.key ? "#2f2f2f" : "#fff",
            color: activeAction === action.key ? "#fff" : "#000",
            fontWeight: 500,
          }}
        >
          <div style={{ fontSize: 22 }}>{action.icon}</div>
          <div style={{ fontSize: 14 }}>{action.label}</div>
        </div>
      </Dropdown>
    );
  })}
</div>


      {/* Tabs */}
      <Tabs defaultActiveKey="1">
        <TabPane tab="Tất cả" key="1">
          {loading ? (
            <div>Đang tải...</div>
          ) : (
            <Table dataSource={items} columns={columns} rowKey="id" />
          )}
        </TabPane>
        <TabPane tab="Gần đây" key="2">
          <p>Chưa có tệp gần đây</p>
        </TabPane>
      </Tabs>

      {/* Modal tạo thư mục */}
      <CreateFolderModal
        open={isFolderModalOpen}
        onCancel={() => setIsFolderModalOpen(false)}
        onCreate={handleCreateFolder}
      />
    </div>
  );
};

export default Dashboard;
