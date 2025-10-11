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
    <div style={{ padding: 12, background: "#fff", borderRadius: 8  }}>
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
                  height: 90,
                  padding: "8px 0",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 8,
                }}
              >
                {/* Hàng 1: icon + tên */}
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
                  <FolderFilled style={{ fontSize: 22, color: "#faad14" ,marginRight:4}} />
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
                {/* Hàng 2: Ngày tạo */}
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
