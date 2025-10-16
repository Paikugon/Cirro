import React, { useState } from "react";
import { Modal, Input, Checkbox, Button } from "antd";
import { FolderFilled } from "@ant-design/icons";

const CreateFolderModal = ({ open, onCancel, onCreate }) => {
  const [folderName, setFolderName] = useState("");
  const [auto, setAuto] = useState(false);

  const handleCreate = () => {
    if (folderName.trim()) {
      onCreate({ folderName, auto });
      setFolderName("");
      setAuto(false);
    }
  };

  return (
    <Modal
      open={open}
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <FolderFilled style={{ fontSize: 28, color: "#69b1ff" }} />
          <span style={{ fontSize: 18, fontWeight: 600 }}>Create folder</span>
        </div>
      }
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="create"
          type="primary"
          disabled={!folderName.trim()}
          onClick={handleCreate}
          style={{
            backgroundColor: folderName.trim() ? "#1677ff" : "#d9d9d9",
            borderColor: folderName.trim() ? "#1677ff" : "#d9d9d9",
          }}
        >
          Create
        </Button>,
      ]}
      centered
      width={480}
      style={{ borderRadius: 12 }}
    >
      {/* Folder Name Input */}
      <div style={{ marginBottom: 24 }}>
        <label style={{ fontWeight: 500, display: "block", marginBottom: 6 }}>
          Folder name
        </label>
        <Input
          placeholder="Folder name"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          style={{
            borderRadius: 8,
            height: 40,
            borderColor: "#1677ff",
          }}
        />
      </div>
    </Modal>
  );
};

export default CreateFolderModal;
