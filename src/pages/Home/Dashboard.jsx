import React, { useState, useEffect, useContext } from "react";
import { Dropdown, Menu, Tabs, Table, message, Spin, Modal, Form, Input, Button } from "antd";
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
import { createPermissionByEmail } from "../../api/permissionApi";
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

  // --- Share state ---
  const [isShareModalVisible, setIsShareModalVisible] = useState(false);
  const [shareItem, setShareItem] = useState(null);
  const [shareType, setShareType] = useState(null);
  const [form] = Form.useForm();
  const [messageApi, contextHolderMessage] = message.useMessage();
  const [modal] = Modal.useModal();

  // --- Upload require folder modal state ---
  const [isUploadRequireFolderModalOpen, setIsUploadRequireFolderModalOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      message.warning("Vui lòng đăng nhập để xem dashboard");
      navigate("/login");
    }
  }, [navigate]);

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
            if (record.type === "folder") navigate(`/folder/${record.id}`);
            else window.open(record.url, "_blank");
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
                { key: "share", label: "Chia sẻ" },
                { key: "delete", label: "Xóa" },
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
      case "share":
        if (!record) return;
        setShareItem(record);
        setShareType(record.type);
        setIsShareModalVisible(true);
        setTimeout(() => form.resetFields(), 100);
        break;
      case "delete":
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
              if (record.type === "folder") await deleteFolder(record.id);
              else await deleteFile(record.id);
              message.success(`Xóa ${record.type} ${record.name} thành công!`);
              setItems((prev) => prev.filter((item) => item.id !== record.id));
            } catch (error) {
              console.error("Lỗi khi xóa:", error);
              const errMsg =
                error.response?.status === 404
                  ? `${record.name} không tồn tại!`
                  : `Không thể xóa ${record.name}!`;
              message.error(errMsg);
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
      const userId = user?.userId || getUserId();
      if (!userId) {
        message.error("Không tìm thấy thông tin người dùng!");
        navigate("/login");
        return;
      }

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

  const handleShareSubmit = async (values) => {
    try {
      const payload = {
        email: values.email,
        fileId: shareType === "file" ? shareItem.id : null,
        folderId: shareType === "folder" ? shareItem.id : null,
        permissionType: "Edit",
      };
      console.log("Payload chia sẻ:", payload);

      const res = await createPermissionByEmail(payload);

      if (res.status >= 200 && res.status < 300) {
        messageApi.success(
          `Đã chia sẻ ${shareType} "${shareItem.name}" thành công với ${values.email}`
        );
        setIsShareModalVisible(false);
        setShareItem(null);
        setShareType(null);
        form.resetFields();
      } else {
        messageApi.error(res.data?.message || "Chia sẻ thất bại!");
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message || "Không thể chia sẻ! Thử lại.";
      messageApi.error(errMsg);
      console.error("Lỗi khi chia sẻ:", error);
    }
  };

  // Handler chuyển tiếp sang trang thư mục
  const handleGoToFolderPage = () => {
    setIsUploadRequireFolderModalOpen(false);
    navigate("/folder");
  };

  return (
    <>
      <div style={{ padding: 24 }}>
        {contextHolderMessage}
        <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
          {actions.map((action) => {
            let menu = null;
            switch (action.key) {
              case "upload":
                menu = (
                  <Menu
                    onClick={({ key }) => {
                      if (key === "uploadFile") {
                        setIsUploadRequireFolderModalOpen(true);
                      } else if (key === "uploadFolder") {
                        // thực hiện logic tải lên thư mục thực tế, tạm thời thông báo
                        message.info("Chức năng tải lên thư mục đang phát triển");
                      }
                    }}
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
              <Dropdown key={action.key} overlay={menu} trigger={["click"]} placement="bottomLeft">
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

        {/* Modal: Phải tạo thư mục trước khi tải lên tệp */}
        <Modal
          title="Thông báo"
          open={isUploadRequireFolderModalOpen}
          onCancel={() => setIsUploadRequireFolderModalOpen(false)}
          footer={[
            <Button key="cancel" onClick={() => setIsUploadRequireFolderModalOpen(false)}>
              Đóng
            </Button>,
            <Button key="folder" type="primary" onClick={handleGoToFolderPage}>
              Chuyển sang trang thư mục
            </Button>,
          ]}
          centered
          closable
        >
          <div style={{ fontSize: 16, padding: "12px 0" }}>
            Bạn cần phải tạo thư mục trước khi có thể tải lên file.<br />
            Vui lòng tạo thư mục và thực hiện tải lên tập tin bên trong thư mục đó.
          </div>
        </Modal>

        {/* Modal chia sẻ qua email */}
        <Modal
          title={`Chia sẻ ${shareType === "file" ? "tệp" : "thư mục"}`}
          open={isShareModalVisible}
          onCancel={() => {
            setIsShareModalVisible(false);
            setShareItem(null);
            setShareType(null);
            form.resetFields();
          }}
          footer={null}
          destroyOnClose
        >
          <Form form={form} layout="vertical" onFinish={handleShareSubmit}>
            <Form.Item
              name="email"
              label="Email người nhận"
              rules={[
                { required: true, message: "Vui lòng nhập email!" },
                { type: "email", message: "Email không hợp lệ!" },
              ]}
            >
              <Input placeholder="Nhập email người nhận" />
            </Form.Item>
            <Form.Item>
              <div style={{ display: "flex", gap: 8 }}>
                <Button type="primary" htmlType="submit">
                  Gửi
                </Button>
                <Button
                  onClick={() => {
                    setIsShareModalVisible(false);
                    setShareItem(null);
                    setShareType(null);
                    form.resetFields();
                  }}
                >
                  Hủy
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
};

export default Dashboard;
