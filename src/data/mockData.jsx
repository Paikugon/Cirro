// mockData.jsx

export const mockUsers = [
  {
    id: 1,
    username: "admin",
    password: "123456",
    role: "admin",
    name: "Admin User",
    token: "mock-token-admin",
  },
  {
    id: 2,
    username: "test",
    password: "test",
    role: "user",
    name: "Test User",
    token: "mock-token-test",
  },
];

// Folder + file mô phỏng Drive
export const mockDrive = [
  {
    id: "folder-1",
    name: "Tài liệu học tập",
    type: "folder",
    children: [
      {
        id: "file-1",
        name: "Bài tập mạng.pdf",
        type: "file",
        size: "1.2MB",
        owner: "admin",
        createdAt: "2025-09-20",
      },
      {
        id: "file-2",
        name: "Đồ án.docx",
        type: "file",
        size: "500KB",
        owner: "test",
        createdAt: "2025-09-21",
      },
    ],
  },
  {
    id: "folder-2",
    name: "Ảnh",
    type: "folder",
    children: [
      {
        id: "file-3",
        name: "avatar.png",
        type: "file",
        size: "350KB",
        owner: "test",
        createdAt: "2025-09-22",
      },
    ],
  },
];
