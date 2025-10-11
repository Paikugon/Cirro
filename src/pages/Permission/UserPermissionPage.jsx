import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Table, Typography, Button, Space, Popconfirm, message } from "antd";
import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import { getPermissionsByUser, deletePermission } from "../../api/permissionApi";
import { getFolderById } from "../../api/folderApi";
import { getFileById } from "../../api/fileApi";

const { Text } = Typography;

export default function UserPermissionPage() {
  const userId = "8a541c76-f5e9-4788-97a0-0f6f7fd338b7";
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPermissions = async () => {
      setLoading(true);
      try {
        const res = await getPermissionsByUser(userId);
        if (res.data.statusCode === 200) {
          const perms = res.data.data;
          const permsWithName = await Promise.all(
            perms.map(async (p) => {
              let name = "";
              if (p.fileId) {
                const fileRes = await getFileById(p.fileId);
                name = fileRes.data.statusCode === 200 ? fileRes.data.data.name : "Không xác định";
              } else if (p.folderId) {
                const folderRes = await getFolderById(p.folderId);
                name = folderRes.data.statusCode === 200 ? folderRes.data.data.name : "Không xác định";
              }
              return { ...p, name };
            })
          );

          setPermissions(permsWithName);
        } else {
          message.error(res.data.message || "Lỗi khi tải quyền!");
        }
      } catch (err) {
        console.error(err);
        message.error("Không thể tải quyền!");
      } finally {
        setLoading(false);
      }
    };

    if (userId) loadPermissions();
  }, [userId]);

  const handleDelete = async (permissionId) => {
    try {
      const res = await deletePermission(permissionId);
      if (res.data.statusCode === 200 || res.status === 200) {
        message.success("Xoá quyền thành công!");
        setPermissions((prev) => prev.filter((p) => p.permissionId !== permissionId));
      } else {
        message.error(res.data.message || "Xoá quyền thất bại!");
      }
    } catch (err) {
      console.error(err);
      message.error("Không thể xoá quyền!");
    }
  };

  const columns = [
    {
      title: "Tên file / thư mục",
      dataIndex: "name",
      key: "name",
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
            onClick={() => message.info(`Chi tiết quyền ${record.permissionType}`)}
          />
          <Popconfirm
            title="Xoá quyền này?"
            okText="Xoá"
            cancelText="Huỷ"
            onConfirm={() => handleDelete(record.permissionId)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 12, background: "#fff", borderRadius: 8 }}>
      <Text strong style={{ fontSize: 16 }}>Danh sách được chia sẻ cho tôi</Text>
      <Table
        columns={columns}
        dataSource={permissions}
        rowKey="permissionId"
        loading={loading}
        pagination={false}
        style={{ marginTop: 8 }}
      />
      {permissions.length === 0 && !loading && <Text>Chưa mục nào.</Text>}
    </div>
  );
}
