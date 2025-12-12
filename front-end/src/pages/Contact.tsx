import { useState, FormEvent } from "react";
import { useTranslation } from "../contexts/LanguageContext";
import {
  HiMail,
  HiPhone,
  HiLocationMarker,
  HiClock,
  HiCheckCircle,
  HiPaperAirplane,
  HiChat,
  HiSupport,
} from "react-icons/hi";

interface ContactInfo {
  icon: typeof HiMail;
  title: string;
  value: string;
  description: string;
}

function Contact() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  // Mock contact info
  const contactInfo: ContactInfo[] = [
    {
      icon: HiPhone,
      title: t("contact.info.phone.title"),
      value: "1900 1234",
      description: t("contact.info.phone.description"),
    },
    {
      icon: HiMail,
      title: t("contact.info.email.title"),
      value: "support@phegonbank.com",
      description: t("contact.info.email.description"),
    },
    {
      icon: HiLocationMarker,
      title: t("contact.info.address.title"),
      value: "123 Đường Nguyễn Huệ, Quận 1, TP.HCM",
      description: t("contact.info.address.description"),
    },
    {
      icon: HiClock,
      title: t("contact.info.hours.title"),
      value: "8:00 - 20:00",
      description: t("contact.info.hours.description"),
    },
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = t("contact.form.errors.nameRequired");
    }

    if (!formData.email.trim()) {
      newErrors.email = t("contact.form.errors.emailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("contact.form.errors.emailInvalid");
    }

    if (!formData.phone.trim()) {
      newErrors.phone = t("contact.form.errors.phoneRequired");
    }

    if (!formData.subject.trim()) {
      newErrors.subject = t("contact.form.errors.subjectRequired");
    }

    if (!formData.message.trim()) {
      newErrors.message = t("contact.form.errors.messageRequired");
    } else if (formData.message.trim().length < 10) {
      newErrors.message = t("contact.form.errors.messageMinLength");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      // Xử lý gửi form với API
      console.log("Contact form:", formData);
      setShowSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            {t("contact.title")}
          </h1>
          <p className="text-xl text-secondary max-w-2xl mx-auto">
            {t("contact.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Info Cards */}
            <div className="space-y-4">
              {contactInfo.map((info) => {
                const Icon = info.icon;
                return (
                  <div
                    key={info.title}
                    className="bg-surface rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-primary mb-1">
                          {info.title}
                        </h3>
                        <p className="text-indigo-600 dark:text-indigo-400 font-medium mb-1">
                          {info.value}
                        </p>
                        <p className="text-sm text-tertiary">{info.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Support */}
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 dark:from-indigo-700 dark:to-indigo-800 rounded-xl shadow-md p-6 text-white">
              <HiSupport className="w-8 h-8 mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {t("contact.quickSupport.title")}
              </h3>
              <p className="text-sm text-indigo-100 mb-4">
                {t("contact.quickSupport.description")}
              </p>
              <button className="w-full px-4 py-2 bg-white text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors">
                {t("contact.quickSupport.button")}
              </button>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-surface rounded-xl shadow-md p-8">
              <div className="flex items-center gap-3 mb-6">
                <HiChat className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-2xl font-bold text-primary">
                  {t("contact.form.title")}
                </h2>
              </div>

              {/* Success Message */}
              {showSuccess && (
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-3">
                  <HiCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <p className="text-sm text-green-700 dark:text-green-400">
                    {t("contact.form.success")}
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">
                      {t("contact.form.name")} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className={`w-full px-4 py-3 input-base border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                        errors.name ? "border-red-500" : ""
                      }`}
                      placeholder={t("contact.form.namePlaceholder")}
                      required
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">
                      {t("contact.form.email")} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className={`w-full px-4 py-3 input-base border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                        errors.email ? "border-red-500" : ""
                      }`}
                      placeholder={t("contact.form.emailPlaceholder")}
                      required
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">
                    {t("contact.form.phone")} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className={`w-full px-4 py-3 input-base border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                      errors.phone ? "border-red-500" : ""
                    }`}
                    placeholder={t("contact.form.phonePlaceholder")}
                    required
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                  )}
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">
                    {t("contact.form.subject")} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => handleChange("subject", e.target.value)}
                    className={`w-full px-4 py-3 input-base border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                      errors.subject ? "border-red-500" : ""
                    }`}
                    placeholder={t("contact.form.subjectPlaceholder")}
                    required
                  />
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-500">{errors.subject}</p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">
                    {t("contact.form.message")} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    rows={6}
                    className={`w-full px-4 py-3 input-base border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none ${
                      errors.message ? "border-red-500" : ""
                    }`}
                    placeholder={t("contact.form.messagePlaceholder")}
                    required
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-500">{errors.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <HiPaperAirplane className="w-5 h-5" />
                  {t("contact.form.submit")}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;

