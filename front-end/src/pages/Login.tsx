import { useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "../contexts/LanguageContext";

function Login() {
  const { t } = useTranslation();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Xử lý đăng nhập với API
    console.log("Login:", { email, password });
    // Giả lập đăng nhập thành công
    localStorage.setItem("token", "fake-token");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-surface rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-primary mb-6 text-center">
          {t("login.title")}
        </h2>
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
            className="w-full px-4 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors font-medium"
          >
            {t("login.submitButton")}
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

