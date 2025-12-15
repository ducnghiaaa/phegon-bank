import { Navigate, useLocation } from "react-router-dom";
import { ReactNode, useEffect, useState } from "react";
import { apiService } from "../services/apiService";

interface ProtectedRouteProps {
  readonly children: ReactNode;
  readonly redirectTo?: string;
}

/**
 * ProtectedRoute - Bảo vệ routes cần authentication
 * Nếu user chưa đăng nhập, redirect đến trang login
 */
function ProtectedRoute({
  children,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Kiểm tra authentication ngay khi component mount
    const checkAuth = () => {
      const authenticated = apiService.isAuthenticated();
      setIsAuthenticated(authenticated);
    };

    checkAuth();

    // Tạo custom event listener để detect khi token thay đổi
    const handleAuthChange = () => {
      checkAuth();
    };

    // Lắng nghe storage events (khi localStorage thay đổi từ tab/window khác)
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

  // Hiển thị loading trong khi kiểm tra (tránh flash)
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-secondary">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Lưu location hiện tại để redirect lại sau khi login
    return (
      <Navigate
        to={redirectTo}
        state={{ from: location }}
        replace
      />
    );
  }

  return <>{children}</>;
}

export default ProtectedRoute;
