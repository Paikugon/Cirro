import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  message,
  Typography,
  Tree,
  Segmented,
  Card,
  Row,
  Col,
  Space,
  Spin,
} from "antd";
import { FolderFilled, EllipsisOutlined, DeleteOutlined, EditOutlined, InfoCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { Dropdown, Button } from "antd";
import { getUserId } from "../../api/api";
import { getFolderById, getFolderTree } from "../../api/folderApi";

const { DirectoryTree } = Tree;
const { Text, Title } = Typography;

export default function FolderPage() {
  const { "*": path } = useParams();
  const navigate = useNavigate();
  const [treeData, setTreeData] = useState([]);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [viewMode, setViewMode] = useState("card");
  const [loading, setLoading] = useState(false);

  const pathIds = path ? path.split("/") : [];
  const currentFolderId = pathIds[pathIds.length - 1] || null;

  useEffect(() => {
    if (currentFolderId) loadFolder(currentFolderId);
    else loadRoot();
    // eslint-disable-next-line
  }, [currentFolderId]);

  const loadRoot = async () => {
    setLoading(true);
    try {
      const res = await getFolderTree(getUserId());
      if (res.data.statusCode === 200) {
        setTreeData(convertToTree(res.data.data));
        setBreadcrumbs([{ id: null, name: "Tất cả tệp" }]);
      } else message.error(res.data.message);
    } catch (err) {
      message.error("Không thể tải cây thư mục!");
    } finally {
      setLoading(false);
    }
  };

  const loadFolder = async (id) => {
    setLoading(true);
    try {
      const res = await getFolderById(id);
      if (res.data.statusCode === 200) {
        const folder = res.data.data;
        setTreeData(convertToTree(folder.children || []));
        setBreadcrumbs(buildBreadcrumb(pathIds, folder));
      } else message.error(res.data.message);
    } catch (err) {
      message.error("Không thể tải thư mục này!");
    } finally {
      setLoading(false);
    }
  };

  const convertToTree = (folders) =>
    folders.map((f) => ({
      title: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Text
            strong
            style={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 18,
            }}
            onClick={() => navigate(`/folder/${f.folderId}`)}
          >
            <FolderFilled
              style={{
                color: "#faad14",
                fontSize: 20,
                marginRight: 8,
                marginBottom: 4,
              }}
            />
            {f.name}
          </Text>
          <Text type="secondary" style={{ fontSize: 14 }}>
            {f.createdAt
              ? new Date(f.createdAt).toLocaleDateString("vi-VN")
              : "—"}
          </Text>
        </div>
      ),
      key: f.folderId,
      children:
        f.children && f.children.length > 0
          ? convertToTree(f.children)
          : undefined,
      raw: f, 
    }));

  const buildBreadcrumb = (ids, folder) => {
    const crumbs = [{ id: null, name: "Tất cả tệp" }];
    ids.forEach((id, idx) => {
      crumbs.push({
        id,
        name: idx === ids.length - 1 ? folder.name : `Thư mục ${id}`,
      });
    });
    return crumbs;
  };

  const handleSelect = (keys) => {
    if (keys.length > 0) navigate(`/folder/${keys[0]}`);
  };

  // Chế độ hiển thị dạng Card
  const renderCardView = () => {
    const folders =
      treeData.map((node) => node.raw) || [];

    return (
      <Row gutter={[16, 16]}>
        {folders.map((f) => (
          <Col xs={24} sm={12} md={8} lg={6} key={f.folderId}>
           <Card
                hoverable
                style={{ borderRadius: 12, position: "relative" }}
                onClick={() => navigate(`/folder/${f.folderId}`)}
              >
                <Dropdown
                  trigger={["click"]}
                  menu={{
                    items: [
                      { key: "view", label: "Xem ", icon: <ExclamationCircleOutlined /> },
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
                      { key: "delete", label: "Xóa", icon: <DeleteOutlined />, danger: true }
                    ],
                    onClick: (e) => handleMenuAction(e.key, f),
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

                {/* Nội dung chính của Card */}
                <Space direction="vertical" size={4}>
                  <Space>
                    <FolderFilled style={{ color: "#faad14", fontSize: 24 }} />
                    <Title level={5} style={{ margin: 0 }}>
                      {f.name}
                    </Title>
                  </Space>
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    Ngày tạo:{" "}
                    {f.createdAt
                      ? new Date(f.createdAt).toLocaleDateString("vi-VN")
                      : "—"}
                  </Text>
                </Space>
              </Card>

          </Col>
        ))}
      </Row>
    );
  };

  // Dummy để tránh lỗi nếu không truyền từ props hoặc định nghĩa ở nơi khác
  const handleMenuAction = (key, folder) => {
    // Tùy trường hợp xử lý, giữ nguyên hoặc thêm logic nếu có
  };

  return (
    <div style={{ padding: 24, background: "#fff", borderRadius: 8, minHeight: 320 }}>
      <Spin spinning={loading}>
        {/* Breadcrumb */}
        <Breadcrumb
          style={{ marginBottom: 16 }}
          items={breadcrumbs.map((bc, idx) => ({
            title: bc.id ? (
              <span
                style={{ cursor: "pointer", color: "#1677ff" }}
                onClick={() =>
                  navigate(
                    bc.id
                      ? `/folder/${pathIds.slice(0, idx).join("/")}`
                      : "/folder"
                  )
                }
              >
                {bc.name}
              </span>
            ) : (
              bc.name
            ),
          }))}
        />

        {/* Chọn chế độ hiển thị */}
        <div style={{ marginBottom: 16 }}>
          <Segmented
            options={[
              { label: "Cây thư mục", value: "tree" },
              { label: "Thẻ thông tin", value: "card" },
            ]}
            value={viewMode}
            onChange={setViewMode}
          />
        </div>

        {/* Hiển thị theo chế độ */}
        {viewMode === "tree" ? (
          <DirectoryTree
            treeData={treeData}
            showIcon={false}
            defaultExpandAll
            onSelect={handleSelect}
            expandAction="doubleClick"
            style={{ background: "#fff", padding: 8, borderRadius: 8 }}
          />
        ) : (
          renderCardView()
        )}
      </Spin>
    </div>
  );
}
