import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Transfer from "../pages/Transfer";
import Wallet from "../pages/Wallet";
import Profile from "../pages/Profile";
import Support from "../pages/Support";
import Contact from "../pages/Contact";
import {
  ProtectedRoute,
  PublicRoute,
  // RoleProtectedRoute, // Uncomment when needed for role-based routes
} from "../middleware";

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      // Public routes
      { path: "/", element: <Home /> },
      {
        path: "/login",
        element: (
          <PublicRoute>
            <Login />
          </PublicRoute>
        ),
      },
      {
        path: "/register",
        element: (
          <PublicRoute>
            <Register />
          </PublicRoute>
        ),
      },
      { path: "/support", element: <Support /> },
      { path: "/contact", element: <Contact /> },

      // Protected routes - Cần authentication
      {
        path: "/transfer",
        element: (
          <ProtectedRoute>
            <Transfer />
          </ProtectedRoute>
        ),
      },
      {
        path: "/wallet",
        element: (
          <ProtectedRoute>
            <Wallet />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },

      // Role-based protected routes
      // Ví dụ: Chỉ ADMIN mới truy cập được
      // {
      //   path: "/admin",
      //   element: (
      //     <RoleProtectedRoute allowedRoles={["ADMIN"]}>
      //       <AdminPage />
      //     </RoleProtectedRoute>
      //   ),
      // },

      // Ví dụ: Chỉ CUSTOMER mới truy cập được
      // {
      //   path: "/customer-dashboard",
      //   element: (
      //     <RoleProtectedRoute allowedRoles={["CUSTOMER"]}>
      //       <CustomerDashboard />
      //     </RoleProtectedRoute>
      //   ),
      // },

      // Ví dụ: Chỉ AUDITOR mới truy cập được
      // {
      //   path: "/audit",
      //   element: (
      //     <RoleProtectedRoute allowedRoles={["AUDITOR"]}>
      //       <AuditPage />
      //     </RoleProtectedRoute>
      //   ),
      // },
    ],
  },
]);

export default router;

