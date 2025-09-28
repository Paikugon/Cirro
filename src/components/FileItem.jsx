import { useState } from "react";

export default function FileItem({ file }) {
  const [open, setOpen] = useState(false);

  if (file.type === "folder") {
    return (
      <div style={{ marginBottom: "10px" }}>
        <div
          style={{
            cursor: "pointer",
            fontWeight: "bold",
            color: "#007bff",
            padding: "5px",
          }}
          onClick={() => setOpen(!open)}
        >
          📁 {file.name} {open ? "▲" : "▼"}
        </div>
        {open && (
          <div style={{ marginLeft: "20px" }}>
            {file.children?.map((child) => (
              <FileItem key={child.id} file={child} />
            ))}
          </div>
        )}
      </div>
    );
  }

  // File thường
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "6px",
        padding: "8px",
        marginBottom: "6px",
        background: "#f9f9f9",
        color: "#333",
      }}
    >
      📄 {file.name}{" "}
      <span style={{ fontSize: "0.85rem", color: "#555" }}>
        ({file.size} - {file.owner})
      </span>
    </div>
  );
}
