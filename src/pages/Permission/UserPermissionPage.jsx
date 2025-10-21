import React, { useEffect, useState } from "react";
import { Table, Typography, Button, Space, message, Modal } from "antd";
import { EyeOutlined, DownloadOutlined } from "@ant-design/icons";
import { getPermissionsByUser } from "../../api/permissionApi";
import { getFolderById } from "../../api/folderApi";
import { getFileById, downloadFile } from "../../api/fileApi";
import { getUserId } from "../../api/api";
import { getUserById } from "../../api/permissionApi";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../untils/formatDate";

const { Text } = Typography;

export default function UserPermissionPage() {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [modal, contextHolder] = Modal.useModal();

  useEffect(() => {
    const loadPermissions = async () => {
      setLoading(true);
      try {
        const userId = getUserId();
        if (!userId) {
          message.error("Không tìm thấy thông tin người dùng!");
          navigate("/login");
          return;
        }

        const res = await getPermissionsByUser(userId);
        if (res.data.statusCode === 200) {
          const perms = res.data.data;
          const permsWithDetails = await Promise.all(
            perms.map(async (p) => {
              let name = "Không xác định";
              let type = p.fileId ? "file" : "folder";
              let createdAt = "";
              let owner = p.ownerName || "Không xác định"; // Sử dụng ownerName từ response
              try {
                if (p.fileId) {
                  const fileRes = await getFileById(p.fileId);
                  if (fileRes.data.statusCode === 200) {
                    name = fileRes.data.data.name;
                    createdAt = fileRes.data.data.createdAt || "";
                  }
                } else if (p.folderId) {
                  const folderRes = await getFolderById(p.folderId);
                  if (folderRes.data.statusCode === 200) {
                    name = folderRes.data.data.name;
                    createdAt = folderRes.data.data.createdAt || "";
                  }
                }
                // Nếu ownerName là rỗng hoặc không có, giữ "Không xác định"
                if (p.ownerName && p.ownerName === getUserId()) {
                  owner = "Bạn"; // Hiển thị "Bạn" nếu ownerName trùng với userId
                }
              } catch (err) {
                console.warn(`Không thể lấy chi tiết cho ${p.fileId || p.folderId}:`, err);
              }
              return {
                ...p,
                name,
                type,
                createdAt: createdAt ? formatDate(createdAt) : "Không có",
                owner,
              };
            })
          );

          setPermissions(permsWithDetails);
        } else {
          message.error(res.data.message || "Lỗi khi tải quyền!");
          setPermissions([]);
        }
      } catch (err) {
        console.error("Lỗi khi tải quyền:", err);
        if (err.response?.status === 401) {
          message.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!");
          navigate("/login");
        } else {
          message.error("Không thể tải quyền!");
        }
        setPermissions([]);
      } finally {
        setLoading(false);
      }
    };

    loadPermissions();
  }, [navigate]);

  const handleViewDetails = (record) => {
    modal.info({
      title: `Chi tiết ${record.type === "file" ? "tệp" : "thư mục"}`,
      content: (
        <div>
          <p><strong>Tên:</strong> {record.name}</p>
          <p><strong>Loại quyền:</strong> {record.permissionType}</p>
          <p><strong>Loại mục:</strong> {record.type === "file" ? "Tệp" : "Thư mục"}</p>
          <p><strong>Chủ sở hữu:</strong> {record.ownerName}</p>
          <p><strong>Ngày tạo:</strong> {record.createdAt}</p>
        </div>
      ),
      okText: "Đóng",
      onOk: () => {},
    });
  };

  const handleDownload = (record) => {
    if (record.type === "file") {
      try {
        downloadFile(record.fileId);
        message.success(`Đang tải xuống ${record.name}...`);
      } catch (err) {
        console.error("Lỗi khi tải xuống:", err);
        message.error(`Không thể tải xuống ${record.name}!`);
      }
    } else {
      message.warning("Tải xuống chỉ khả dụng cho tệp, không áp dụng cho thư mục!");
    }
  };

  const columns = [
    {
      title: "Tên file / thư mục",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Chủ sở hữu",
      dataIndex: "owner",
      key: "owner",
      width: 150,
      render: (text, record) => (
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
    {
      title: "Loại quyền",
      dataIndex: "permissionType",
      key: "permissionType",
      width: 120,
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
          />
          <Button
            icon={<DownloadOutlined />}
            onClick={() => handleDownload(record)}
            disabled={record.type !== "file"}
          />
        </Space>
      ),
    },
  ];

  return (
    <>
      <div style={{ padding: 12, background: "#fff", borderRadius: 8 }}>
        <Text strong style={{ fontSize: 16 }}>
          Danh sách được chia sẻ cho tôi
        </Text>
        <Table
          columns={columns}
          dataSource={permissions}
          rowKey="permissionId"
          loading={loading}
          pagination={false}
          style={{ marginTop: 8 }}
        />
        {permissions.length === 0 && !loading && <Text>Chưa có mục nào.</Text>}
      </div>
      {contextHolder}
    </>
  );
}