import { useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "../contexts/LanguageContext";
import { authApi } from "../services";

function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>("");

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName =
        t("register.errors.firstNameRequired") || "Vui lòng nhập họ";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName =
        t("register.errors.lastNameRequired") || "Vui lòng nhập tên";
    }

    if (!formData.email.trim()) {
      newErrors.email =
        t("register.errors.emailRequired") || "Vui lòng nhập email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email =
        t("register.errors.emailInvalid") || "Email không hợp lệ";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber =
        t("register.errors.phoneRequired") || "Vui lòng nhập số điện thoại";
    } else if (
      !/^(0|\+84)[35789]\d{8}$/.test(formData.phoneNumber.replace(/\s+/g, ""))
    ) {
      newErrors.phoneNumber =
        t("register.errors.phoneInvalid") || "Số điện thoại không hợp lệ";
    }

    if (!formData.password) {
      newErrors.password =
        t("register.errors.passwordRequired") || "Vui lòng nhập mật khẩu";
    } else if (formData.password.length < 8) {
      newErrors.password =
        t("register.errors.passwordMinLength") ||
        "Mật khẩu phải có ít nhất 8 ký tự";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword =
        t("register.errors.confirmPasswordRequired") ||
        "Vui lòng xác nhận mật khẩu";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword =
        t("register.errors.passwordMismatch") || "Mật khẩu không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Gọi API đăng ký
      await authApi.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        password: formData.password,
      });

      // Đăng ký thành công, redirect đến trang login
      navigate("/login", {
        state: {
          message:
            t("register.success") || "Đăng ký thành công! Vui lòng đăng nhập.",
        },
      });
    } catch (err: unknown) {
      // Xử lý lỗi
      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as {
          response?: {
            data?: { message?: string };
            status?: number;
          };
        };

        if (axiosError.response?.status === 400) {
          const errorMessage = axiosError.response?.data?.message;
          if (errorMessage?.toLowerCase().includes("email")) {
            setSubmitError(
              t("register.errors.emailExists") ||
                "Email đã được sử dụng. Vui lòng chọn email khác."
            );
          } else {
            setSubmitError(
              errorMessage ||
                t("register.errors.invalidInput") ||
                "Dữ liệu không hợp lệ"
            );
          }
        } else if (axiosError.response?.status === 409) {
          setSubmitError(
            t("register.errors.emailExists") ||
              "Email đã được sử dụng. Vui lòng chọn email khác."
          );
        } else {
          setSubmitError(
            t("register.errors.serverError") ||
              "Đã xảy ra lỗi. Vui lòng thử lại sau."
          );
        }
      } else {
        setSubmitError(
          t("register.errors.networkError") ||
            "Lỗi kết nối. Vui lòng kiểm tra kết nối mạng."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-surface rounded-xl shadow-lg p-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-primary mb-2">
            {t("register.title")}
          </h2>
          <p className="text-sm text-secondary">{t("register.subtitle")}</p>
        </div>

        {/* Error Message */}
        {submitError && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">
              {submitError}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* First Name Field */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-secondary mb-2"
              >
                {t("register.firstName")}
              </label>
              <input
                type="text"
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                className={`w-full px-4 py-2 input-base border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                  errors.firstName ? "border-red-500" : ""
                }`}
                placeholder={t("register.firstNamePlaceholder")}
                required
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
              )}
            </div>

            {/* Last Name Field */}
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-secondary mb-2"
              >
                {t("register.lastName")}
              </label>
              <input
                type="text"
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                className={`w-full px-4 py-2 input-base border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                  errors.lastName ? "border-red-500" : ""
                }`}
                placeholder={t("register.lastNamePlaceholder")}
                required
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-secondary mb-2"
            >
              {t("register.email")}
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className={`w-full px-4 py-2 input-base border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                errors.email ? "border-red-500" : ""
              }`}
              placeholder={t("register.emailPlaceholder")}
              required
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Phone Number Field */}
          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-secondary mb-2"
            >
              {t("register.phoneNumber")}
            </label>
            <input
              type="tel"
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={(e) => handleChange("phoneNumber", e.target.value)}
              className={`w-full px-4 py-2 input-base border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                errors.phoneNumber ? "border-red-500" : ""
              }`}
              placeholder={t("register.phoneNumberPlaceholder")}
              required
            />
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-500">{errors.phoneNumber}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-secondary mb-2"
            >
              {t("register.password")}
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              className={`w-full px-4 py-2 input-base border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                errors.password ? "border-red-500" : ""
              }`}
              placeholder={t("register.passwordPlaceholder")}
              required
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-secondary mb-2"
            >
              {t("register.confirmPassword")}
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              className={`w-full px-4 py-2 input-base border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                errors.confirmPassword ? "border-red-500" : ""
              }`}
              placeholder={t("register.confirmPasswordPlaceholder")}
              required
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Terms */}
          <div className="text-xs text-secondary text-center">
            {t("register.terms")}{" "}
            <button
              type="button"
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              {t("register.termsLink")}
            </button>
          </div>

          {/* Submit Button */}
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
                <span>{t("register.loading") || "Đang đăng ký..."}</span>
              </>
            ) : (
              t("register.submitButton")
            )}
          </button>
        </form>

        {/* Links */}
        <div className="mt-6 space-y-3 text-center">
          <div>
            <span className="text-sm text-secondary">
              {t("register.hasAccount")}{" "}
            </span>
            <Link
              to="/login"
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
            >
              {t("register.loginLink")}
            </Link>
          </div>
          <div>
            <Link
              to="/"
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
            >
              {t("register.backToHome")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
