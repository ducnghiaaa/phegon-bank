import { Navigate, useLocation } from "react-router-dom";
import { ReactNode } from "react";
import { apiService, Role } from "../services/apiService";

interface RoleProtectedRouteProps {
  readonly children: ReactNode;
  readonly allowedRoles: readonly Role[];
  readonly redirectTo?: string;
  readonly fallback?: ReactNode;
}

/**
 * RoleProtectedRoute - Bảo vệ routes dựa trên role
 * Chỉ cho phép user có role trong allowedRoles truy cập
 */
function RoleProtectedRoute({
  children,
  allowedRoles,
  redirectTo = "/",
  fallback,
}: RoleProtectedRouteProps) {
  const location = useLocation();
  const isAuthenticated = apiService.isAuthenticated();

  // Nếu chưa đăng nhập, redirect đến login
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // Kiểm tra user có ít nhất một role được phép
  const hasAllowedRole = allowedRoles.some((role) =>
    apiService.hasRole(role)
  );

  if (!hasAllowedRole) {
    // Nếu có fallback, hiển thị fallback (ví dụ: trang 403)
    if (fallback) {
      return <>{fallback}</>;
    }

    // Nếu không có fallback, redirect về trang chủ
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}

export default RoleProtectedRoute;

