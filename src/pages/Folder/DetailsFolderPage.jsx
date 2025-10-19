import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  Typography,
  List,
  Card,
  Table,
  Button,
  Space,
  Popconfirm,
  message,
  Tooltip,
  Dropdown,
  Spin,
  Modal,
  Input,
  Form,
} from "antd";
import {
  FolderFilled,
  FileOutlined,
  EyeOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EllipsisOutlined,
  EditOutlined,
  InfoCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { getFolderContent } from "../../api/folderApi";
import {
  getFilesByFolder,
  deleteFile,
  downloadFile,
  uploadFile,
} from "../../api/fileApi";
import { createPermissionByEmail } from "../../api/permissionApi";
import { getUserId } from "../../api/api";

const { Title, Text } = Typography;

export default function DetailsFolderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [folderData, setFolderData] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isShareModalVisible, setIsShareModalVisible] = useState(false);
  const [shareItem, setShareItem] = useState(null);
  const [shareType, setShareType] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  // For upload file
  const uploadInputRef = useRef();

  useEffect(() => {
    const loadFolderContent = async () => {
      if (!id) {
        message.error("Không tìm thấy ID thư mục!");
        setLoading(false);
        return;
      }

      try {
        const resFolder = await getFolderContent(id);
        if (resFolder.data.statusCode === 200) {
          const data = resFolder.data.data || {};
          data.subFolders = Array.isArray(data.subFolders) ? data.subFolders : [];
          setFolderData(data);
        } else {
          message.error(resFolder.data.message || "Lỗi khi tải nội dung thư mục!");
        }

        const resFiles = await getFilesByFolder(id);
        if (resFiles.data.statusCode === 200) {
          setFiles(resFiles.data.data || []);
        } else if (resFiles.status !== 404) {
          message.warning(resFiles.data.message || "Không có tệp trong thư mục này.");
        }
      } catch (err) {
        console.error("Lỗi khi gọi API:", err);
        message.error("Không thể tải dữ liệu thư mục hoặc tệp!");
      } finally {
        setLoading(false);
      }
    };

    loadFolderContent();
  }, [id]);

  const handleFolderClick = (folderId) => {
    navigate(`/folder/${folderId}`);
  };

  const handleView = (file) => {
    window.open(file.filePath, "_blank");
  };

  const handleDelete = async (file) => {
    try {
      const res = await deleteFile(file.fileId);
      if (res.data.statusCode === 200) {
        message.success("Đã xoá tệp thành công!");
        setFiles((prev) => prev.filter((f) => f.fileId !== file.fileId));
      } else {
        message.error(res.data.message || "Xoá thất bại!");
      }
    } catch (error) {
      message.error("Không thể xoá tệp!");
      console.error(error);
    }
  };

  const handleShareByEmail = (item, type) => {
    setShareItem(item);
    setShareType(type);
    setIsShareModalVisible(true);
    setTimeout(() => {
      form.resetFields();
    }, 100); 
  };

  // Đảm bảo luôn post lên có trường email
  const handleShareSubmit = async (values) => {
    try {
      const payload = {
        email: values.email, 
        fileId: shareType === "file" && shareItem && shareItem.fileId ? shareItem.fileId : null,
        folderId: shareType === "folder" && shareItem && shareItem.folderId ? shareItem.folderId : null,
        permissionType: "Edit",
      };
      console.log(payload);

      const res = await createPermissionByEmail(payload);

      if (res.data.statusCode === 200) {
        messageApi.success(`Đã chia sẻ ${shareType === "file" ? "tệp" : "thư mục"} thành công với ${values.email}!`);
        setIsShareModalVisible(false);
        setShareItem(null);
        setShareType(null);
        form.resetFields();
      } else {
        messageApi.error(res.data.message || "Chia sẻ thất bại!");
      }
    } catch (error) {
      messageApi.error("Không thể chia sẻ! Vui lòng thử lại.");
      console.error("Lỗi khi chia sẻ:", error);
    }
  };

  const handleMenuAction = (key, item, type) => {
    if (type === "folder") {
      switch (key) {
        case "download":
          message.info("Tải xuống thư mục: " + item.name);
          // Thêm logic tải xuống thư mục (nếu có API)
          break;
        case "rename":
          message.info("Đổi tên thư mục: " + item.name);
          // Thêm logic đổi tên thư mục
          break;
        case "share_link":
          message.info("Tạo liên kết chia sẻ cho thư mục: " + item.name);
          // Thêm logic chia sẻ liên kết
          break;
        case "share_user":
          handleShareByEmail(item, "folder");
          break;
        case "info":
          message.info("Thông tin thư mục: " + item.name);
          // Thêm logic hiển thị thông tin
          break;
        case "delete":
          message.info("Xóa thư mục: " + item.name);
          // Thêm logic xóa thư mục (cần API mới)
          break;
        default:
          break;
      }
    } else if (type === "file") {
      switch (key) {
        case "view":
          handleView(item);
          break;
        case "download":
          downloadFile(item.fileId);
          break;
        case "rename":
          message.info("Đổi tên tệp: " + item.name);
          // Thêm logic đổi tên tệp
          break;
        case "share_link":
          message.info("Tạo liên kết chia sẻ cho tệp: " + item.name);
          // Thêm logic chia sẻ liên kết
          break;
        case "share_user":
          handleShareByEmail(item, "file");
          break;
        case "info":
          message.info("Thông tin tệp: " + item.name);
          // Thêm logic hiển thị thông tin
          break;
        case "delete":
          handleDelete(item);
          break;
        default:
          break;
      }
    }
  };

  // Xử lý upload file
  const handleUploadClick = () => {
    if (uploadInputRef.current) {
      uploadInputRef.current.value = null; 
      uploadInputRef.current.click();
    }
  };

  const handleUploadChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      message.error("Vui lòng chọn một tệp!");
      return;
    }
  
    if (!id) {
      message.error("Không tìm thấy ID thư mục!");
      return;
    }
  
    // Kiểm tra kích thước file (giới hạn 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      message.error("Kích thước tệp vượt quá 10MB!");
      return;
    }
  
    // Kiểm tra định dạng file
    const allowedExtensions = [".pdf", ".docx", ".jpg", ".png", ".txt"];
    const fileExtension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      message.error(`Chỉ hỗ trợ các định dạng: ${allowedExtensions.join(", ")}`);
      return;
    }
  
    try {
      const ownerId = getUserId();
      if (!ownerId) {
        message.error("Không thể xác định người dùng!");
        return;
      }
  
      // Tạo FormData để gửi file và các trường dữ liệu
      const formData = new FormData();
      formData.append("file", file); // Thêm file vào form-data
      formData.append("folderId", id); // Thêm folderId
      formData.append("ownerId", ownerId); // Thêm ownerId
  
      message.loading({ content: "Đang tải lên...", key: "upload_file" });
      const res = await uploadFile(formData); // Gửi formData thay vì payload JSON
      if (res?.data?.statusCode === 200) {
        message.success({ content: "Tải tệp lên thành công!", key: "upload_file" });
        const resFiles = await getFilesByFolder(id);
        if (resFiles.data.statusCode === 200) {
          setFiles(resFiles.data.data || []);
        } else {
          message.warning(resFiles.data.message || "Không thể làm mới danh sách tệp!");
        }
      } else {
        message.error({ content: res?.data?.message || "Tải tệp lên thất bại!", key: "upload_file" });
      }
    } catch (error) {
      message.error({ content: error?.response?.data?.message || "Tải tệp lên thất bại!", key: "upload_file" });
      console.error("Lỗi khi tải lên:", error);
    }
  };


  const columns = [
    {
      title: "Tên tệp",
      dataIndex: "name",
      key: "name",
      render: (text, file) => (
        <Space>
          <FileOutlined style={{ color: "#1677ff" }} />
          {text}
        </Space>
      ),
    },
    {
      title: "Kích thước",
      dataIndex: "size",
      key: "size",
      render: (size) => `${(size / 1024).toFixed(2)} KB`,
      align: "right",
      width: 120,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) =>
        date ? new Date(date).toLocaleDateString("vi-VN") : "--",
      width: 140,
    },
    {
      title: "Thao tác",
      key: "actions",
      align: "center",
      width: 100,
      render: (_, file) => (
        <Dropdown
          trigger={["click"]}
          menu={{
            items: [
              { key: "view", label: "Xem tệp", icon: <EyeOutlined /> },
              { key: "download", label: "Tải xuống", icon: <DownloadOutlined /> },
              { key: "rename", label: "Đổi tên", icon: <EditOutlined /> },
              { type: "divider" },
              {
                key: "share",
                label: "Chia sẻ",
                children: [
                  { key: "share_link", label: "Tạo liên kết chia sẻ" },
                  { key: "share_user", label: "Chia sẻ với người dùng..." },
                ],
              },
              { key: "info", label: "Thông tin về tệp", icon: <InfoCircleOutlined /> },
              { type: "divider" },
              {
                key: "delete",
                label: "Xóa",
                icon: <DeleteOutlined />,
                danger: true,
              },
            ],
            onClick: (e) => handleMenuAction(e.key, file, "file"),
          }}
        >
          <Button
            type="text"
            icon={<EllipsisOutlined />}
            onClick={(e) => e.stopPropagation()}
          />
        </Dropdown>
      ),
    },
  ];

  if (loading)
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 200 }}>
        <Spin />
      </div>
    );
  if (!folderData)
    return <div>Không tìm thấy dữ liệu thư mục!</div>;

  return (
    <div style={{ padding: 12, background: "#fff", borderRadius: 8 }}>
       {contextHolder} 
      <Breadcrumb
        style={{ marginBottom: 16 }}
        items={[
          {
            title: (
              <span
                style={{ cursor: "pointer", color: "#1677ff" }}
                onClick={() => navigate("/folder")}
              >
                Tất cả tệp
              </span>
            ),
          },
          {
            title: folderData.folderName || folderData.name || "Thư mục không tên",
          },
        ]}
      />

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
        destroyOnHidden
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleShareSubmit}
          layout="vertical"
        >
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
          <Form.Item shouldUpdate>
            {() => (
              <Space>
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
              </Space>
            )}
          </Form.Item>
        </Form>
      </Modal>

      {/* --- SubFolders --- */}
      {folderData.subFolders?.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <Text strong style={{ fontSize: 16 }}>
            Thư mục
          </Text>
          <List
            grid={{ gutter: 16, column: 6 }}
            dataSource={folderData.subFolders}
            renderItem={(folder) => (
              <List.Item>
                <Card
                  hoverable
                  onClick={() => handleFolderClick(folder.folderId)}
                  style={{
                    textAlign: "center",
                    height: 90,
                    padding: "2px 0",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 8,
                    position: "relative",
                  }}
                >
                  <Dropdown
                    trigger={["click"]}
                    menu={{
                      items: [
                        { key: "rename", label: "Đổi tên", icon: <EditOutlined /> },
                        { type: "divider" },
                        {
                          key: "share",
                          label: "Chia sẻ",
                          children: [
                            { key: "share_link", label: "Tạo liên kết chia sẻ" },
                            { key: "share_user", label: "Chia sẻ với người dùng..." },
                          ],
                        },
                        { key: "info", label: "Thông tin về thư mục", icon: <InfoCircleOutlined /> },
                        { type: "divider" },
                        { key: "delete", label: "Xóa", icon: <DeleteOutlined />, danger: true },
                      ],
                      onClick: (e) => handleMenuAction(e.key, folder, "folder"),
                    }}
                  >
                    <Button
                      type="text"
                      icon={<EllipsisOutlined />}
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        color: "#555",
                      }}
                    />
                  </Dropdown>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                      marginBottom: 10,
                      marginTop: 10,
                    }}
                  >
                    <FolderFilled style={{ fontSize: 22, color: "#faad14", marginRight: 4 }} />
                    <Text
                      strong
                      style={{
                        fontSize: 14,
                        wordWrap: "break-word",
                        maxWidth: "100px",
                      }}
                    >
                      {folder.name || "Thư mục không tên"}
                    </Text>
                  </div>
                  <Text
                    type="secondary"
                    style={{
                      fontSize: 12,
                    }}
                  >
                    {folder.createdAt
                      ? new Date(folder.createdAt).toLocaleDateString("vi-VN")
                      : "—"}
                  </Text>
                </Card>
              </List.Item>
            )}
          />
        </div>
      )}

      {/* --- Files --- */}
      {(files.length > 0 || true) && (
        <div>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
            <Text strong style={{ fontSize: 16, flex: 1 }}>
              Tệp tin
            </Text>
            <Tooltip title="Tải tệp lên">
              <Button
                icon={<UploadOutlined />}
                onClick={handleUploadClick}
                style={{ marginLeft: 8 }}
              >
                Tải lên
              </Button>
            </Tooltip>
            <input
              ref={uploadInputRef}
              type="file"
              accept="*"
              style={{ display: "none" }}
              onChange={handleUploadChange}
            />
          </div>
          {files.length > 0 ? (
            <Table
              columns={columns}
              dataSource={files}
              rowKey="fileId"
              pagination={false}
              style={{ marginTop: 8 }}
            />
          ) : (
            <Text type="secondary">Không có tệp nào.</Text>
          )}
        </div>
      )}

      {/* --- Empty --- */}
      {(!folderData.subFolders?.length && !files.length) && (
        <Text>Thư mục này trống.</Text>
      )}
    </div>
  );
}