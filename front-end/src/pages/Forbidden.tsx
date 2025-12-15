import { Link } from "react-router-dom";
import { useTranslation } from "../contexts/LanguageContext";
import { HiLockClosed } from "react-icons/hi";

function Forbidden() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-surface rounded-xl shadow-lg p-8 text-center">
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <HiLockClosed className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-primary mb-4">403</h1>
        <h2 className="text-2xl font-semibold text-primary mb-4">
          {t("forbidden.title") || "Truy cập bị từ chối"}
        </h2>
        <p className="text-secondary mb-6">
          {t("forbidden.message") ||
            "Bạn không có quyền truy cập trang này. Vui lòng liên hệ quản trị viên nếu bạn cho rằng đây là lỗi."}
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/"
            className="px-6 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
          >
            {t("forbidden.goHome") || "Về trang chủ"}
          </Link>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-primary rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            {t("forbidden.goBack") || "Quay lại"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Forbidden;

