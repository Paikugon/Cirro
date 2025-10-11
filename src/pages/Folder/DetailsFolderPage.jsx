import React, { useEffect, useState } from "react";
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
} from "antd";
import {
  FolderFilled,
  FileOutlined,
  EyeOutlined,
  DeleteOutlined,
  DownloadOutlined,
} from "@ant-design/icons";

import { getFolderContent } from "../../api/folderApi";
import {
  getFilesByFolder,
  deleteFile,
  downloadFile,
} from "../../api/fileApi";

const { Title, Text } = Typography;

export default function DetailsFolderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [folderData, setFolderData] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🟢 Gọi API Folder + File
  useEffect(() => {
    const loadFolderContent = async () => {
      if (!id) {
        message.error("Không tìm thấy ID thư mục!");
        setLoading(false);
        return;
      }

      try {
        // Gọi API lấy thông tin folder (tên + subFolders)
        const resFolder = await getFolderContent(id);
        if (resFolder.data.statusCode === 200) {
          const data = resFolder.data.data || {};
          data.subFolders = Array.isArray(data.subFolders) ? data.subFolders : [];
          setFolderData(data);
        } else {
          message.error(resFolder.data.message || "Lỗi khi tải nội dung thư mục!");
        }

        // Gọi API lấy danh sách file trong folder
        const resFiles = await getFilesByFolder(id);
        if (resFiles.data.statusCode === 200) {
          setFiles(resFiles.data.data || []);
        } else if (resFiles.status !== 404) {
          // 404 = folder không có file
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

  // 🟡 Thao tác file
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

  // 🧱 Cột Table hiển thị file
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
      width: 180,
      render: (_, file) => (
        <Space>
          <Tooltip title="Xem tệp">
            <Button icon={<EyeOutlined />} onClick={() => handleView(file)} />
          </Tooltip>
          <Tooltip title="Tải xuống">
            <Button icon={<DownloadOutlined />} onClick={() => downloadFile(file.fileId)} />
          </Tooltip>
          <Tooltip title="Xoá tệp">
            <Popconfirm
              title="Xoá tệp?"
              okText="Xoá"
              cancelText="Huỷ"
              onConfirm={() => handleDelete(file)}
            >
              <Button danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  if (loading) return <div>Đang tải...</div>;
  if (!folderData) return <div>Không tìm thấy dữ liệu thư mục!</div>;

  return (
    <div style={{ padding: 24, background: "#fff", borderRadius: 8 }}>
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

      {/* --- SubFolders --- */}
      {folderData.subFolders?.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <Text strong style={{ fontSize: 16 }}>Thư mục</Text>
          <List
            grid={{ gutter: 16, column: 8 }}
            dataSource={folderData.subFolders}
            renderItem={(folder) => (
              <List.Item>
                <Card
                  hoverable
                  onClick={() => handleFolderClick(folder.folderId)}
                  style={{
                    textAlign: "center",
                    height: 80,
                    padding: "4px 0",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 8,
                  }}
                >
                  <FolderFilled style={{ fontSize: 24, color: "#faad14" }} />
                  <Text
                    style={{
                      display: "block",
                      marginTop: 6,
                      fontSize: 13,
                      wordWrap: "break-word",
                    }}
                  >
                    {folder.name || "Thư mục không tên"}
                  </Text>
                </Card>
              </List.Item>
            )}
          />
        </div>
      )}

      {/* --- Files --- */}
      {files.length > 0 && (
        <div>
          <Text strong style={{ fontSize: 16 }}>Tệp tin</Text>
          <Table
            columns={columns}
            dataSource={files}
            rowKey="fileId"
            pagination={false}
            style={{ marginTop: 8 }}
          />
        </div>
      )}

      {/* --- Empty --- */}
      {(!folderData.subFolders?.length && !files.length) && (
        <Text>Thư mục này trống.</Text>
      )}
    </div>
  );
}
