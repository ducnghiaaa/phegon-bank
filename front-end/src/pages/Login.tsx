import { useState, FormEvent } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useTranslation } from "../contexts/LanguageContext";
import { authApi } from "../services";
import { apiService, Role } from "../services/apiService";
import { useAuth } from "../hooks/useAuth";

function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { login: updateAuthState } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authApi.login({ email, password });
      const { token, roles } = response.data.data;

      // Lưu token và roles vào localStorage
      const userRoles: Role[] = roles
        ? (roles.filter((r) => ["ADMIN", "CUSTOMER", "AUDITOR"].includes(r)) as Role[])
        : [];
      apiService.saveAuthData(token, userRoles);

      // Update auth state
      updateAuthState(token, userRoles);

      // Redirect về trang trước đó hoặc trang chủ
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/";
      navigate(from, { replace: true });
    } catch (err: unknown) {
      // Xử lý lỗi
      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as { response?: { data?: { message?: string }; status?: number } };
        if (axiosError.response?.status === 401) {
          setError(t("login.errors.invalidCredentials") || "Email hoặc mật khẩu không đúng");
        } else if (axiosError.response?.status === 400) {
          setError(
            axiosError.response?.data?.message ||
              t("login.errors.invalidInput") ||
              "Dữ liệu không hợp lệ"
          );
        } else {
          setError(t("login.errors.serverError") || "Đã xảy ra lỗi. Vui lòng thử lại sau.");
        }
      } else {
        setError(t("login.errors.networkError") || "Lỗi kết nối. Vui lòng kiểm tra kết nối mạng.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-surface rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-primary mb-6 text-center">
          {t("login.title")}
        </h2>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-secondary mb-2"
            >
              {t("login.email")}
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 input-base border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder={t("login.emailPlaceholder")}
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-secondary mb-2"
            >
              {t("login.password")}
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 input-base border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder={t("login.passwordPlaceholder")}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>{t("login.loading") || "Đang đăng nhập..."}</span>
              </>
            ) : (
              t("login.submitButton")
            )}
          </button>
        </form>
        <div className="mt-6 space-y-3 text-center">
          <div>
            <span className="text-sm text-secondary">
              {t("login.noAccount")}{" "}
            </span>
            <Link
              to="/register"
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
            >
              {t("login.registerLink")}
            </Link>
          </div>
          <div>
            <Link
              to="/"
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
            >
              {t("login.backToHome")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

