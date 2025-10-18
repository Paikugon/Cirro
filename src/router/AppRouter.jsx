import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../components/layouts/MainLayout";
import Dashboard from "../pages/Home/Dashboard";
import FolderPage from "../pages/Folder/FolderPage";
import DetailsFolderPage from "../pages/Folder/DetailsFolderPage";
import UserPermissionPage from "../pages/Permission/UserPermissionPage";
import HelpPage from "../pages/HelpPage";
import NotFound from "../pages/NotFound";
import Login from "../pages/Auth/Login";
import RegisterPage from "../pages/Auth/RegisterPage";

export default function AppRouter() {
  return (
    <Routes>
      {/* Redirect mặc định */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Các trang có layout */}
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/folder/*" element={<FolderPage />} />
        <Route path="/folder/:id" element={<DetailsFolderPage />} />
        <Route path="/permission/shared" element={<UserPermissionPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Trang không dùng layout */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
