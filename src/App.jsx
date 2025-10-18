import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router/AppRouter";
import { AuthProvider } from "./context/AuthContext";
import { message } from "antd";

export default function App() {
  const [messageApi, contextHolder] = message.useMessage();

  return (
    <BrowserRouter>
      {contextHolder}
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </BrowserRouter>
  );
}
