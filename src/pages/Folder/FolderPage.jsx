// File: src/pages/Folder/FolderPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Breadcrumb, message, Typography } from "antd";
import { FolderFilled } from "@ant-design/icons";
import { getFolderById, getFolderTree } from "../../api/folderApi";

import { Tree } from 'antd';
const { DirectoryTree } = Tree;
const { Text } = Typography;

export default function FolderPage() {
  const { "*": path } = useParams();
  const navigate = useNavigate();
  const [treeData, setTreeData] = useState([]);
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  const pathIds = path ? path.split("/") : [];
  const currentFolderId = pathIds[pathIds.length - 1] || null;

  useEffect(() => {
    if (currentFolderId) loadFolder(currentFolderId);
    else loadRoot();
  }, [currentFolderId]);

  const loadRoot = async () => {
    try {
      const res = await getFolderTree("5f7c51d3-a2fa-48df-a2f5-03ea647b2d22");
      if (res.data.statusCode === 200) {
        setTreeData(convertToTree(res.data.data));
        setBreadcrumbs([{ id: null, name: "Tất cả tệp" }]);
      } else message.error(res.data.message);
    } catch (err) {
      message.error("Không thể tải cây thư mục!");
    }
  };

  const loadFolder = async (id) => {
    try {
      const res = await getFolderById(id);
      if (res.data.statusCode === 200) {
        const folder = res.data.data;
        setTreeData(convertToTree(folder.children || []));
        setBreadcrumbs(buildBreadcrumb(pathIds, folder));
      } else message.error(res.data.message);
    } catch (err) {
      message.error("Không thể tải thư mục này!");
    }
  };

  const convertToTree = (folders) =>
    folders.map((f) => ({
      title: (
        <Text
          strong
          style={{ cursor: "pointer" }}
          onClick={() => navigate(`/folder/${f.folderId}`)}
        >
          <FolderFilled style={{ color: "#faad14", marginRight: 8 }} />
          {f.name}
        </Text>
      ),
      key: f.folderId,
      children:
        f.children && f.children.length > 0 ? convertToTree(f.children) : undefined,
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

  return (
    <div style={{ padding: 24, background: "#fff", borderRadius: 8 }}>
      <Breadcrumb
        style={{ marginBottom: 16 }}
        items={breadcrumbs.map((bc, idx) => ({
          title: bc.id ? (
            <span
              style={{ cursor: "pointer", color: "#1677ff" }}
              onClick={() =>
                navigate(
                  bc.id ? `/folder/${pathIds.slice(0, idx).join("/")}` : "/folder"
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

      <DirectoryTree
        treeData={treeData}
        showIcon={false}
        defaultExpandAll
        onSelect={handleSelect}
        expandAction="doubleClick"
        style={{ background: "#fff", padding: 8, borderRadius: 8 }}
      />
    </div>
  );
}