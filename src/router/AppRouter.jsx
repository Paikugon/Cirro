import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../components/layouts/MainLayout";
import HomePage from "../pages/Home/HomePage";
import Dashboard from "../pages/Home/Dashboard";
import FolderPage from "../pages/Folder/FolderPage";
import DetailsFolderPage from "../pages/Folder/DetailsFolderPage";
import UserPermissionPage from "../pages/Permission/UserPermissionPage";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route element={<MainLayout />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/folder/*" element={<FolderPage />} />
        <Route path="/folder/:id" element={<DetailsFolderPage />} />
        <Route path="/permission/shared" element={<UserPermissionPage />} />

      </Route>
    </Routes>
  );
}