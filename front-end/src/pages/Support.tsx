import { useState } from "react";
import { useTranslation } from "../contexts/LanguageContext";
import {
  HiQuestionMarkCircle,
  HiBookOpen,
  HiVideoCamera,
  HiDocumentText,
  HiChevronDown,
  HiChevronUp,
  HiSearch,
  HiLightBulb,
  HiAcademicCap,
} from "react-icons/hi";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface Tutorial {
  id: string;
  title: string;
  description: string;
  type: "video" | "article" | "guide";
  duration?: string;
  level: "beginner" | "intermediate" | "advanced";
}

function Support() {
  const { t } = useTranslation();
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Mock FAQ data
  const faqs: FAQ[] = [
    {
      id: "1",
      question: "Làm thế nào để đăng ký tài khoản ngân hàng?",
      answer:
        "Bạn có thể đăng ký tài khoản trực tuyến bằng cách truy cập trang Đăng ký, điền đầy đủ thông tin cá nhân, xác thực số điện thoại và email. Sau khi hoàn tất, bạn sẽ nhận được thông báo xác nhận và có thể bắt đầu sử dụng dịch vụ ngay lập tức.",
      category: "account",
    },
    {
      id: "2",
      question: "Tôi quên mật khẩu đăng nhập, phải làm sao?",
      answer:
        "Bạn có thể khôi phục mật khẩu bằng cách nhấn vào 'Quên mật khẩu' trên trang đăng nhập. Hệ thống sẽ gửi mã OTP đến email hoặc số điện thoại đã đăng ký. Sau khi nhập mã OTP, bạn có thể đặt mật khẩu mới.",
      category: "security",
    },
    {
      id: "3",
      question: "Làm thế nào để nạp tiền vào tài khoản?",
      answer:
        "Bạn có thể nạp tiền qua nhiều phương thức: chuyển khoản ngân hàng, ví điện tử, tiền mặt tại quầy, hoặc thanh toán QR. Vào mục Ví & Tài khoản, chọn tài khoản và phương thức nạp tiền phù hợp. Hệ thống sẽ hướng dẫn bạn từng bước.",
      category: "deposit",
    },
    {
      id: "4",
      question: "Phí giao dịch rút tiền là bao nhiêu?",
      answer:
        "Phí rút tiền là 1% trên số tiền rút, tối thiểu 5,000 VND. Ví dụ: nếu bạn rút 1,000,000 VND, phí sẽ là 10,000 VND. Số tiền thực nhận sẽ được hiển thị rõ ràng trước khi bạn xác nhận giao dịch.",
      category: "withdraw",
    },
    {
      id: "5",
      question: "Làm sao để xem lịch sử giao dịch?",
      answer:
        "Bạn có thể xem lịch sử giao dịch tại trang Chuyển khoản. Tại đây, bạn có thể tìm kiếm, lọc theo loại giao dịch (gửi/nhận), trạng thái, và xem chi tiết từng giao dịch bao gồm ngày giờ, số tiền, và nội dung.",
      category: "transaction",
    },
    {
      id: "6",
      question: "Tài khoản của tôi có bảo mật không?",
      answer:
        "Chúng tôi sử dụng công nghệ mã hóa SSL/TLS, xác thực 2FA, và OTP cho mọi giao dịch quan trọng. Thông tin của bạn được bảo vệ theo tiêu chuẩn PCI DSS và tuân thủ các quy định bảo mật quốc tế.",
      category: "security",
    },
  ];

  // Mock Tutorial data
  const tutorials: Tutorial[] = [
    {
      id: "1",
      title: "Hướng dẫn đăng ký tài khoản lần đầu",
      description: "Tìm hiểu cách tạo tài khoản ngân hàng số trong 5 phút",
      type: "video",
      duration: "5:30",
      level: "beginner",
    },
    {
      id: "2",
      title: "Cách nạp và rút tiền an toàn",
      description: "Hướng dẫn chi tiết các phương thức nạp/rút tiền và bảo mật",
      type: "article",
      level: "beginner",
    },
    {
      id: "3",
      title: "Quản lý tài khoản và thẻ hiệu quả",
      description: "Tối ưu hóa việc sử dụng nhiều tài khoản và thẻ ngân hàng",
      type: "guide",
      level: "intermediate",
    },
    {
      id: "4",
      title: "Bảo mật tài khoản nâng cao",
      description: "Các biện pháp bảo mật và phòng chống lừa đảo",
      type: "video",
      duration: "12:15",
      level: "advanced",
    },
    {
      id: "5",
      title: "Sử dụng tính năng chuyển khoản nhanh",
      description: "Hướng dẫn chuyển khoản liên ngân hàng và nội bộ",
      type: "article",
      level: "intermediate",
    },
    {
      id: "6",
      title: "Đầu tư và tiết kiệm thông minh",
      description: "Các công cụ và chiến lược đầu tư tài chính",
      type: "guide",
      level: "advanced",
    },
  ];

  const categories = [
    { id: "all", name: t("support.categories.all") },
    { id: "account", name: t("support.categories.account") },
    { id: "security", name: t("support.categories.security") },
    { id: "deposit", name: t("support.categories.deposit") },
    { id: "withdraw", name: t("support.categories.withdraw") },
    { id: "transaction", name: t("support.categories.transaction") },
  ];

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400";
      case "intermediate":
        return "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400";
      case "advanced":
        return "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400";
      default:
        return "";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <HiVideoCamera className="w-5 h-5" />;
      case "article":
        return <HiDocumentText className="w-5 h-5" />;
      case "guide":
        return <HiBookOpen className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            {t("support.title")}
          </h1>
          <p className="text-xl text-secondary max-w-2xl mx-auto">
            {t("support.subtitle")}
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <HiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("support.searchPlaceholder")}
              className="w-full pl-12 pr-4 py-4 input-base border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
            />
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-surface rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <HiQuestionMarkCircle className="w-12 h-12 text-indigo-600 dark:text-indigo-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-primary mb-2">
              {t("support.quickLinks.faq")}
            </h3>
            <p className="text-sm text-secondary">
              {t("support.quickLinks.faqDesc")}
            </p>
          </div>
          <div className="bg-surface rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <HiBookOpen className="w-12 h-12 text-indigo-600 dark:text-indigo-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-primary mb-2">
              {t("support.quickLinks.tutorials")}
            </h3>
            <p className="text-sm text-secondary">
              {t("support.quickLinks.tutorialsDesc")}
            </p>
          </div>
          <div className="bg-surface rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <HiLightBulb className="w-12 h-12 text-indigo-600 dark:text-indigo-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-primary mb-2">
              {t("support.quickLinks.tips")}
            </h3>
            <p className="text-sm text-secondary">
              {t("support.quickLinks.tipsDesc")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FAQs Section */}
          <div className="lg:col-span-2">
            <div className="bg-surface rounded-xl shadow-md p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
                  <HiQuestionMarkCircle className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  {t("support.faq.title")}
                </h2>
              </div>

              {/* Category Filter */}
              <div className="flex gap-2 flex-wrap mb-6">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      selectedCategory === category.id
                        ? "bg-indigo-600 dark:bg-indigo-500 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-secondary hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>

              {/* FAQ List */}
              <div className="space-y-4">
                {filteredFAQs.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-secondary">
                      {t("support.faq.noResults")}
                    </p>
                  </div>
                ) : (
                  filteredFAQs.map((faq) => (
                    <div
                      key={faq.id}
                      className="border border-surface rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() =>
                          setOpenFAQ(openFAQ === faq.id ? null : faq.id)
                        }
                        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <span className="font-semibold text-primary pr-4">
                          {faq.question}
                        </span>
                        {openFAQ === faq.id ? (
                          <HiChevronUp className="w-5 h-5 text-tertiary flex-shrink-0" />
                        ) : (
                          <HiChevronDown className="w-5 h-5 text-tertiary flex-shrink-0" />
                        )}
                      </button>
                      {openFAQ === faq.id && (
                        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-surface">
                          <p className="text-secondary leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Tutorials Section */}
          <div className="lg:col-span-1">
            <div className="bg-surface rounded-xl shadow-md p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
                <HiAcademicCap className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                {t("support.tutorials.title")}
              </h2>
              <div className="space-y-4">
                {tutorials.map((tutorial) => (
                  <div
                    key={tutorial.id}
                    className="p-4 border border-surface rounded-lg hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <div className="text-indigo-600 dark:text-indigo-400 mt-1">
                        {getTypeIcon(tutorial.type)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-primary text-sm mb-1">
                          {tutorial.title}
                        </h3>
                        <p className="text-xs text-secondary mb-2">
                          {tutorial.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${getLevelColor(
                              tutorial.level
                            )}`}
                          >
                            {t(`support.tutorials.levels.${tutorial.level}`)}
                          </span>
                          {tutorial.duration && (
                            <span className="text-xs text-tertiary">
                              {tutorial.duration}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Support;

