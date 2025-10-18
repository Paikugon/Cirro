import React, { useState, useEffect, useContext } from "react";
import { Dropdown, Menu, Tabs, Table, message, Spin, Modal } from "antd";
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
import { getFilesByUser, deleteFile } from "../../api/fileApi";
import { createFolder, getFoldersByUser, deleteFolder } from "../../api/folderApi";
import { useNavigate } from "react-router-dom";
import { getUserId } from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import { formatDate } from "../../untils/formatDate";

const { TabPane } = Tabs;

const Dashboard = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [activeAction, setActiveAction] = useState("upload");
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [modal, contextHolder] = Modal.useModal(); // Thêm useModal cho Ant Design v5

  // Nếu chưa đăng nhập hoặc đang loading auth, xử lý tương ứng
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      message.warning("Vui lòng đăng nhập để xem dashboard");
      navigate("/login");
    }
  }, [navigate]);

  // Load danh sách thư mục + file
  const loadData = async () => {
    try {
      const userId = getUserId();
      if (!userId) {
        message.error("Không tìm thấy thông tin người dùng!");
        navigate("/login");
        return;
      }

      setLoading(true);

      const [folderRes, fileRes] = await Promise.allSettled([
        getFoldersByUser(userId),
        getFilesByUser(userId),
      ]);

      const folders =
        folderRes.status === "fulfilled" && folderRes.value.data.statusCode === 200
          ? folderRes.value.data.data.map((f) => ({
              id: f.folderId,
              name: f.name,
              owner: f.ownerId === userId ? "Bạn" : f.ownerName || "Bạn",
              createdAt: formatDate(f.createdAt),
              type: "folder",
            }))
          : [];

      const files =
        fileRes.status === "fulfilled" && fileRes.value.data.statusCode === 200
          ? fileRes.value.data.data.map((f) => ({
              id: f.fileId,
              name: f.name,
              owner: f.ownerId === userId ? "Bạn" : f.ownerName || "Bạn",
              createdAt: formatDate(f.createdAt),
              type: "file",
              url: f.filePath,
            }))
          : [];

      setItems([...folders, ...files]);
    } catch (err) {
      if (err.response?.status === 404) {
        setItems([]);
      } else {
        console.error("Lỗi khi tải dữ liệu:", err);
        message.error("Không thể tải dữ liệu!");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

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

  // Helper function để xác định icon file theo type file
  const getFileIcon = (fileName) => {
    const ext = (fileName?.split(".").pop() || "").toLowerCase();
    if (["doc", "docx", "txt", "md", "pdf", "rtf", "odt"].includes(ext))
      return <FileTextOutlined style={{ color: "#0670e7" }} />;
    if (["xls", "xlsx", "csv", "ods"].includes(ext))
      return <FileExcelOutlined style={{ color: "#34a853" }} />;
    if (["ppt", "pptx", "odp"].includes(ext))
      return <FilePptOutlined style={{ color: "#fa7b17" }} />;
    return <FileTextOutlined style={{ color: "#909090" }} />;
  };

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
          style={{ display: "flex", alignItems: "center", gap: 8 }}
        >
          {record.type === "folder" ? (
            <FolderAddOutlined style={{ color: "#f5b942", fontSize: 18 }} />
          ) : (
            getFileIcon(record.name)
          )}
          {text}
        </a>
      ),
    },
    {
      title: "Chủ sở hữu",
      dataIndex: "owner",
      key: "owner",
      render: (text) => (
        <span
          style={{
            display: "inline-block",
            padding: "1px 6px",
            borderRadius: 6,
            border: "1px solid #0670e7",  
            backgroundColor: "#e6f0ff",     
            color: "#0654c2",               
            fontWeight: 400,
          }}
        >
          {text}
        </span>
      ),
    },
    { title: "Ngày tạo", dataIndex: "createdAt", key: "createdAt" },
    {
      title: "",
      key: "action",
      render: (_, record) => (
        <Dropdown
          overlay={
            <Menu
              onClick={({ key }) => handleMenuAction({ key, record })}
              items={[
                { key: "1", label: "Chia sẻ" },
                { key: "2", label: "Xóa" },
              ]}
            />
          }
        >
          <MoreOutlined />
        </Dropdown>
      ),
    },
  ];

  const handleMenuAction = async ({ key, record }) => {
    switch (key) {
      case "folder":
        setIsFolderModalOpen(true);
        break;
      case "1":
        message.info(`Chia sẻ: ${record?.name || "Không xác định"}`);
        break;
      case "2":
        if (!record) {
          message.error("Không xác định được mục để xóa!");
          return;
        }
        modal.confirm({
          title: `Xác nhận xóa ${record.type === "folder" ? "thư mục" : "tệp"}`,
          content: `Bạn có chắc chắn muốn xóa ${record.name}? Hành động này không thể hoàn tác!`,
          okText: "Xóa",
          okType: "danger",
          cancelText: "Hủy",
          onOk: async () => {
            try {
              if (record.type === "folder") {
                await deleteFolder(record.id);
                message.success(`Xóa thư mục ${record.name} thành công!`);
              } else {
                await deleteFile(record.id);
                message.success(`Xóa tệp ${record.name} thành công!`);
              }
              setItems((prev) => prev.filter((item) => item.id !== record.id));
            } catch (error) {
              console.error("Lỗi khi xóa:", error);
              if (error.response?.status === 404) {
                message.error(`${record.name} không tồn tại!`);
              } else {
                message.error(`Không thể xóa ${record.name}!`);
              }
            }
          },
        });
        break;
      default:
        message.info(`Chọn: ${key}`);
    }
  };

  const handleCreateFolder = async (data) => {
    try {
      let userId = user?.userId || getUserId();
      if (!userId) {
        message.error("Không tìm thấy thông tin người dùng!");
        navigate("/login");
        return;
      }
      console.log("gửi dữ liệu tạo folder:", { name: data.folderName, ownerId: userId });
      const res = await createFolder({ name: data.folderName, ownerId: userId });

      if (res.data.statusCode === 201) {
        message.success("Tạo thư mục thành công!");
        setIsFolderModalOpen(false);

        setItems((prev) => [
          {
            id: res.data.data.folderId,
            name: data.folderName,
            owner: userId === user?.userId ? "Bạn" : res.data.data.ownerName || "Bạn",
            createdAt: formatDate(new Date().toISOString()),
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
    <>
      <div style={{ padding: 24 }}>
        {/* Thanh hành động */}
        <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
          {actions.map((action) => {
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
                menu = createMenu;
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
            {authLoading || loading ? (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 200 }}>
                <Spin />
              </div>
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
      {contextHolder} {/* Thêm contextHolder cho Modal */}
    </>
  );
};

export default Dashboard;