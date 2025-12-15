import { Navigate } from "react-router-dom";
import { ReactNode, useEffect, useState } from "react";
import { apiService } from "../services/apiService";

interface PublicRouteProps {
  readonly children: ReactNode;
  readonly redirectTo?: string;
}

/**
 * PublicRoute - Chỉ cho phép truy cập khi chưa đăng nhập
 * Thường dùng cho trang Login, Register
 * Nếu đã đăng nhập, redirect về trang chủ hoặc trang được chỉ định
 */
function PublicRoute({
  children,
  redirectTo = "/",
}: PublicRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Kiểm tra authentication ngay khi component mount
    const checkAuth = () => {
      const authenticated = apiService.isAuthenticated();
      setIsAuthenticated(authenticated);
    };

    checkAuth();

    // Lắng nghe storage events
    const handleAuthChange = () => {
      checkAuth();
    };

    if (globalThis.window !== undefined) {
      globalThis.window.addEventListener("storage", handleAuthChange);
    }

    // Tạo một interval để check authentication định kỳ (fallback)
    const interval = setInterval(checkAuth, 1000);

    return () => {
      if (globalThis.window !== undefined) {
        globalThis.window.removeEventListener("storage", handleAuthChange);
      }
      clearInterval(interval);
    };
  }, []);

  // Hiển thị loading trong khi kiểm tra
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-secondary">Loading...</div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}

export default PublicRoute;


