import { useLoading } from "../contexts/LoadingContext";
import { useTranslation } from "../contexts/LanguageContext";

function Loading() {
  const { loading } = useLoading();
  const { t } = useTranslation();

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/20 dark:bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-indigo-200 dark:border-indigo-800 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin"></div>
        </div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {t("loading.text") || "Đang tải..."}
        </p>
      </div>
    </div>
  );
}

export default Loading;

