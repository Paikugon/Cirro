import React from "react";
import { Modal, Menu } from "antd";
import { DownloadOutlined, EditOutlined, DeleteOutlined, InfoCircleOutlined, ShareAltOutlined } from "@ant-design/icons";

const FolderModal = ({ visible, folder, onOk, onCancel }) => {
  return (
    <Modal
      title={folder ? folder.name : "Tùy chọn"}
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
      footer={null}
    >
      <Menu>
        <Menu.Item key="download" icon={<DownloadOutlined />}>
          Tải xuống
        </Menu.Item>
        <Menu.Item key="rename" icon={<EditOutlined />}>
          Đổi tên
        </Menu.Item>
        <Menu.Item key="summary" icon={<InfoCircleOutlined />}>
          Tóm tắt thư mục này
        </Menu.Item>
        <Menu.Item key="share" icon={<ShareAltOutlined />}>
          Chia sẻ
        </Menu.Item>
        <Menu.Item key="delete" icon={<DeleteOutlined />}>
          Xóa
        </Menu.Item>
        <Menu.Item key="info" icon={<InfoCircleOutlined />}>
          Thông tin về thư mục
        </Menu.Item>
      </Menu>
    </Modal>
  );
};

export default FolderModal;