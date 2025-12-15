import { useState, useEffect, FormEvent, useRef } from "react";
import { useTranslation } from "../contexts/LanguageContext";
import { userApi } from "../services";
import { useLoading } from "../contexts/LoadingContext";
import type { User, Account } from "../types/api.types";
import {
  HiUser,
  HiMail,
  HiPhone,
  HiLockClosed,
  HiCamera,
  HiCheckCircle,
  HiXCircle,
} from "react-icons/hi";
import { formatCurrency } from "../utils/format";

function Profile() {
  const { t } = useTranslation();
  const { setLoading } = useLoading();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoadingLocal] = useState(true);
  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");
  const [profileError, setProfileError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile form state
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Fetch user profile
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoadingLocal(true);
      const response = await userApi.getMyProfile();
      const userData = response.data.data;
      setUser(userData);
      setProfileData({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || "",
        phoneNumber: userData.phoneNumber || "",
      });
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      setProfileError(t("profile.errors.fetchFailed") || "Không thể tải thông tin người dùng");
    } finally {
      setLoadingLocal(false);
    }
  };

  const handleProfileUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProfileError("");
    setSuccessMessage("");

    if (!user) return;

    try {
      setLoading(true);
      await userApi.update(user.id.toString(), {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
        phoneNumber: profileData.phoneNumber,
      });

      // Refresh user data
      await fetchUserProfile();
      setSuccessMessage(t("profile.success.updateProfile") || "Cập nhật thông tin thành công!");
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string }; status?: number };
        };
        setProfileError(
          axiosError.response?.data?.message ||
            t("profile.errors.updateFailed") ||
            "Cập nhật thông tin thất bại"
        );
      } else {
        setProfileError(t("profile.errors.networkError") || "Lỗi kết nối. Vui lòng thử lại sau.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordError("");
    setSuccessMessage("");

    // Validate passwords
    if (passwordData.newPassword.length < 8) {
      setPasswordError(t("profile.errors.passwordMinLength") || "Mật khẩu mới phải có ít nhất 8 ký tự");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError(t("profile.errors.passwordMismatch") || "Mật khẩu mới không khớp");
      return;
    }

    try {
      setLoading(true);
      await userApi.updatePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });

      setSuccessMessage(t("profile.success.updatePassword") || "Đổi mật khẩu thành công!");
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string }; status?: number };
        };
        if (axiosError.response?.status === 400) {
          setPasswordError(
            axiosError.response?.data?.message ||
              t("profile.errors.invalidPassword") ||
              "Mật khẩu cũ không đúng"
          );
        } else {
          setPasswordError(
            axiosError.response?.data?.message ||
              t("profile.errors.updatePasswordFailed") ||
              "Đổi mật khẩu thất bại"
          );
        }
      } else {
        setPasswordError(t("profile.errors.networkError") || "Lỗi kết nối. Vui lòng thử lại sau.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setProfileError(t("profile.errors.invalidFileType") || "Vui lòng chọn file ảnh");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setProfileError(t("profile.errors.fileTooLarge") || "File ảnh không được vượt quá 5MB");
      return;
    }

    try {
      setLoading(true);
      setProfileError("");
      setSuccessMessage("");
      const response = await userApi.uploadProfilePicture(file);
      // API trả về { data: User, message: string, statusCode: number }
      const updatedUser = response.data.data;
      setUser(updatedUser);
      setSuccessMessage(t("profile.success.updateAvatar") || "Cập nhật ảnh đại diện thành công!");
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string }; status?: number };
        };
        setProfileError(
          axiosError.response?.data?.message ||
            t("profile.errors.uploadFailed") ||
            "Tải ảnh lên thất bại"
        );
      } else {
        setProfileError(t("profile.errors.networkError") || "Lỗi kết nối. Vui lòng thử lại sau.");
      }
    } finally {
      setLoading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const getUserDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.email) {
      return user.email.split("@")[0];
    }
    return "User";
  };

  const getUserAvatarChar = () => {
    if (user?.firstName) {
      return user.firstName.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  if (loading && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-secondary">{t("loading.text") || "Đang tải..."}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <HiXCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-lg text-secondary mb-4">
            {t("profile.errors.userNotFound") || "Không tìm thấy thông tin người dùng"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            {t("profile.title") || "Thông tin cá nhân"}
          </h1>
          <p className="text-secondary">
            {t("profile.subtitle") || "Quản lý thông tin tài khoản và cài đặt bảo mật"}
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-2">
            <HiCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            <p className="text-sm text-green-600 dark:text-green-400">{successMessage}</p>
          </div>
        )}

        {/* Error Message */}
        {(profileError || passwordError) && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2">
            <HiXCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <p className="text-sm text-red-600 dark:text-red-400">
              {profileError || passwordError}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - User Info */}
          <div className="lg:col-span-1">
            <div className="bg-surface dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-24">
              {/* Avatar Section */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  {user.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={getUserDisplayName()}
                      className="w-32 h-32 rounded-full object-cover border-4 border-indigo-500 dark:border-indigo-400"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center border-4 border-indigo-500 dark:border-indigo-400">
                      <span className="text-white text-4xl font-bold">
                        {getUserAvatarChar()}
                      </span>
                    </div>
                  )}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 w-10 h-10 bg-indigo-600 dark:bg-indigo-500 text-white rounded-full flex items-center justify-center hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors shadow-lg"
                    aria-label="Upload avatar"
                  >
                    <HiCamera className="w-5 h-5" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
                <h2 className="text-xl font-bold text-primary mt-4">{getUserDisplayName()}</h2>
                <p className="text-sm text-secondary">{user.email}</p>
              </div>

              {/* User Stats */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 text-secondary">
                  <HiMail className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-sm">{user.email}</span>
                </div>
                <div className="flex items-center gap-3 text-secondary">
                  <HiPhone className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-sm">{user.phoneNumber || "N/A"}</span>
                </div>
                <div className="flex items-center gap-3 text-secondary">
                  <HiUser className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <div className="flex flex-wrap gap-1">
                    {user.roles.map((role) => (
                      <span
                        key={role.id}
                        className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs rounded-full"
                      >
                        {role.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Accounts Summary */}
              {user.accounts && user.accounts.length > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h3 className="text-sm font-semibold text-primary mb-3">
                    {t("profile.accounts.title") || "Tài khoản"}
                  </h3>
                  <div className="space-y-2">
                    {user.accounts.map((account: Account) => (
                      <div
                        key={account.id}
                        className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                      >
                        <p className="text-xs text-secondary mb-1">
                          {account.accountNumber}
                        </p>
                        <p className="text-sm font-semibold text-primary">
                          {formatCurrency(account.balance, account.currency)}
                        </p>
                        <p className="text-xs text-secondary mt-1">{account.accountType}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Content - Forms */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="bg-surface dark:bg-gray-800 rounded-xl shadow-lg mb-6">
              <div className="flex border-b border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    setActiveTab("profile");
                    setProfileError("");
                    setPasswordError("");
                    setSuccessMessage("");
                  }}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === "profile"
                      ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400"
                      : "text-secondary hover:text-primary"
                  }`}
                >
                  {t("profile.tabs.profile") || "Thông tin cá nhân"}
                </button>
                <button
                  onClick={() => {
                    setActiveTab("password");
                    setProfileError("");
                    setPasswordError("");
                    setSuccessMessage("");
                  }}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === "password"
                      ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400"
                      : "text-secondary hover:text-primary"
                  }`}
                >
                  {t("profile.tabs.password") || "Đổi mật khẩu"}
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === "profile" ? (
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="firstName"
                          className="block text-sm font-medium text-secondary mb-2"
                        >
                          {t("profile.form.firstName") || "Họ"}
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          value={profileData.firstName}
                          onChange={(e) =>
                            setProfileData({ ...profileData, firstName: e.target.value })
                          }
                          className="w-full px-4 py-2 input-base border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="lastName"
                          className="block text-sm font-medium text-secondary mb-2"
                        >
                          {t("profile.form.lastName") || "Tên"}
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          value={profileData.lastName}
                          onChange={(e) =>
                            setProfileData({ ...profileData, lastName: e.target.value })
                          }
                          className="w-full px-4 py-2 input-base border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-secondary mb-2"
                      >
                        {t("profile.form.email") || "Email"}
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={profileData.email}
                        onChange={(e) =>
                          setProfileData({ ...profileData, email: e.target.value })
                        }
                        className="w-full px-4 py-2 input-base border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="phoneNumber"
                        className="block text-sm font-medium text-secondary mb-2"
                      >
                        {t("profile.form.phoneNumber") || "Số điện thoại"}
                      </label>
                      <input
                        type="tel"
                        id="phoneNumber"
                        value={profileData.phoneNumber}
                        onChange={(e) =>
                          setProfileData({ ...profileData, phoneNumber: e.target.value })
                        }
                        className="w-full px-4 py-2 input-base border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full md:w-auto px-6 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors font-medium"
                    >
                      {t("profile.form.updateButton") || "Cập nhật thông tin"}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handlePasswordUpdate} className="space-y-6">
                    <div>
                      <label
                        htmlFor="oldPassword"
                        className="block text-sm font-medium text-secondary mb-2"
                      >
                        {t("profile.form.oldPassword") || "Mật khẩu hiện tại"}
                      </label>
                      <input
                        type="password"
                        id="oldPassword"
                        value={passwordData.oldPassword}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, oldPassword: e.target.value })
                        }
                        className="w-full px-4 py-2 input-base border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="newPassword"
                        className="block text-sm font-medium text-secondary mb-2"
                      >
                        {t("profile.form.newPassword") || "Mật khẩu mới"}
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, newPassword: e.target.value })
                        }
                        className="w-full px-4 py-2 input-base border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        required
                        minLength={8}
                      />
                      <p className="mt-1 text-xs text-secondary">
                        {t("profile.form.passwordHint") || "Mật khẩu phải có ít nhất 8 ký tự"}
                      </p>
                    </div>
                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-secondary mb-2"
                      >
                        {t("profile.form.confirmPassword") || "Xác nhận mật khẩu mới"}
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                        }
                        className="w-full px-4 py-2 input-base border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        required
                        minLength={8}
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full md:w-auto px-6 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors font-medium flex items-center gap-2"
                    >
                      <HiLockClosed className="w-5 h-5" />
                      {t("profile.form.updatePasswordButton") || "Đổi mật khẩu"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;

