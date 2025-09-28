import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { useState } from "react";
import Login from "./pages/Login.jsx";
import Drive from "./pages/Drive.jsx";

export default function App() {
  const [user, setUser] = useState(null);

  const router = createBrowserRouter([
    {
      path: "/login",
      element: <Login setUser={setUser} />,
    },
    {
      path: "/drive",
      element: user ? <Drive user={user} /> : <Navigate to="/login" />,
    },
    {
      path: "/",
      element: <Navigate to="/login" />,
    },
  ]);

  return <RouterProvider router={router} />;
}
