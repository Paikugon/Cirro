import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockUsers } from "../data/mockData";

export default function Login({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const foundUser = mockUsers.find(
      (u) => u.username === username && u.password === password
    );

    if (foundUser) {
      setUser(foundUser);
      navigate("/drive");
    } else {
      setError("Sai tên đăng nhập hoặc mật khẩu!");
    }
  };

  const handleQuickLogin = () => {
    const testUser = mockUsers.find((u) => u.username === "test");
    if (testUser) {
      setUser(testUser);
      navigate("/drive");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          border: "1px solid #ccc",
          padding: "2rem",
          borderRadius: "8px",
          minWidth: "300px",
        }}
      >
        <h2 style={{ textAlign: "center" }}>Đăng nhập</h2>

        <div style={{ marginBottom: "1rem" }}>
          <label>Tên đăng nhập</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Mật khẩu</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}
          />
        </div>

        {error && <p style={{ color: "red", fontSize: "0.9rem" }}>{error}</p>}

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            marginBottom: "10px",
          }}
        >
          Đăng nhập
        </button>

        <button
          type="button"
          onClick={handleQuickLogin}
          style={{
            width: "100%",
            padding: "10px",
            background: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Đăng nhập nhanh (Test)
        </button>
      </form>
    </div>
  );
}
