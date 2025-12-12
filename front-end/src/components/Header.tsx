import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { HiSun, HiMoon } from "react-icons/hi";
import { IoLanguage } from "react-icons/io5";
import useTheme from "../hooks/useTheme";
import { useTranslation } from "../contexts/LanguageContext";

function Header() {
  const { theme, toggleTheme } = useTheme();
  const { t, languages, currentLanguage, changeLanguage } = useTranslation();
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const languageDropdownRef = useRef<HTMLDivElement>(null);

  // Đóng dropdown khi click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        languageDropdownRef.current &&
        !languageDropdownRef.current.contains(event.target as Node)
      ) {
        setIsLanguageOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Detect scroll position
  useEffect(() => {
    function handleScroll() {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    }

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg"
          : "bg-indigo-100/50 dark:bg-gray-900/50 shadow-none"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo và Tên */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <Link
              to="/"
              className={`text-xl font-bold transition-colors duration-300 ${
                isScrolled
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-indigo-900 dark:text-gray-100 drop-shadow-sm"
              }`}
            >
              Phegon Bank
            </Link>
          </div>

          {/* Nhóm button bên phải */}
          <div className="flex items-center space-x-2">
            {/* Group button: Hỗ trợ, Liên hệ */}
            <div className="flex items-center space-x-1 mr-2">
              <Link
                to="/support"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out active:scale-95 ${
                  isScrolled
                    ? "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    : "text-indigo-900 dark:text-gray-200 hover:bg-indigo-100/50 dark:hover:bg-white/10 drop-shadow-sm"
                }`}
              >
                {t("header.support")}
              </Link>
              <Link
                to="/contact"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out active:scale-95 ${
                  isScrolled
                    ? "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    : "text-indigo-900 dark:text-gray-200 hover:bg-indigo-100/50 dark:hover:bg-white/10 drop-shadow-sm"
                }`}
              >
                {t("header.contact")}
              </Link>
            </div>

            {/* Divider */}
            <div
              className={`w-px h-6 mx-2 transition-colors duration-300 ${
                isScrolled
                  ? "bg-gray-300 dark:bg-gray-700"
                  : "bg-indigo-300/50 dark:bg-gray-400/30"
              }`}
            />

            {/* Group button: Theme, Language, Đăng nhập */}
            <div className="flex items-center space-x-2">
              {/* Theme Toggle Button - Bo tròn */}
              <button
                onClick={toggleTheme}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ease-in-out active:scale-95 ${
                  isScrolled
                    ? "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    : "text-indigo-900 dark:text-gray-200 hover:bg-indigo-100/50 dark:hover:bg-white/10"
                }`}
                aria-label="Toggle theme"
              >
                {theme === "light" ? (
                  <HiMoon className="w-5 h-5 transition-transform duration-300 hover:rotate-12" />
                ) : (
                  <HiSun className="w-5 h-5 transition-transform duration-300 hover:rotate-12" />
                )}
              </button>

              {/* Language Toggle Button với Dropdown - Bo tròn */}
              <div className="relative" ref={languageDropdownRef}>
                <button
                  onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ease-in-out active:scale-95 ${
                    isScrolled
                      ? "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      : "text-indigo-900 dark:text-gray-200 hover:bg-indigo-100/50 dark:hover:bg-white/10"
                  }`}
                  aria-label="Change language"
                >
                  <IoLanguage
                    className={`w-5 h-5 transition-transform duration-200 ${
                      isLanguageOpen ? "rotate-12" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isLanguageOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50 dropdown-enter origin-top-right">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          changeLanguage(lang.code);
                          setIsLanguageOpen(false);
                        }}
                        className={`w-full px-4 py-2 text-left flex items-center space-x-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-150 ease-in-out ${
                          currentLanguage.code === lang.code
                            ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        <span className="text-xl transition-transform duration-150 hover:scale-110">{lang.flag}</span>
                        <span className="text-sm font-medium">{lang.name}</span>
                        {currentLanguage.code === lang.code && (
                          <span className="ml-auto text-indigo-600 dark:text-indigo-400 animate-in fade-in duration-200">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Đăng nhập Button */}
              <Link
                to="/login"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out active:scale-95 ${
                  isScrolled
                    ? "text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                    : "text-indigo-600 dark:text-indigo-400 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-700 backdrop-blur-sm"
                }`}
              >
                {t("header.login")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;
