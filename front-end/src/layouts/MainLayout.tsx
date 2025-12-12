import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import { useTranslation } from "../contexts/LanguageContext";

function MainLayout() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Outlet />
      </main>
      <footer className="bg-surface border-surface border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-tertiary text-sm">
            {t("footer.copyright")}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default MainLayout;

