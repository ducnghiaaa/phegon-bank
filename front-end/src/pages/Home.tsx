import { useTranslation } from "../contexts/LanguageContext";
import {
  HiArrowRight,
  HiCurrencyDollar,
  HiCreditCard,
  HiChartBar,
  HiShieldCheck,
  HiSupport,
  HiStar,
} from "react-icons/hi";
import { FaPiggyBank, FaQuoteLeft } from "react-icons/fa";

function Home() {
  const { t } = useTranslation();

  const features = [
    {
      key: "transfer",
      icon: HiCurrencyDollar,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      key: "savings",
      icon: FaPiggyBank,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      key: "cards",
      icon: HiCreditCard,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      key: "investment",
      icon: HiChartBar,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
    },
    {
      key: "security",
      icon: HiShieldCheck,
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-900/20",
    },
    {
      key: "support",
      icon: HiSupport,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
    },
  ];

  // Company logos for marquee
  const companies = [
    { name: "NovateLabs", icon: "🔬" },
    { name: "GlobalTeam", icon: "🌐" },
    { name: "CloudSync", icon: "☁️" },
    { name: "DataFlow", icon: "📊" },
    { name: "TechCorp", icon: "🏢" },
    { name: "StartupHub", icon: "🚀" },
    { name: "InnoTech", icon: "💡" },
  ];

  // Statistics
  const stats = [
    { value: "100K+", key: "teams" },
    { value: "50M+", key: "transactions" },
    { value: "20+", key: "services" },
    { value: "99.9%", key: "uptime" },
  ];

  // Testimonials
  const testimonials = [1, 2, 3];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-6 shadow-sm">
            <span className="text-lg">⚡</span>
            {t("home.tag")}
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-primary mb-6">
            {t("home.title")}
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-secondary max-w-3xl mx-auto">
            {t("home.subtitle")}
          </p>

          {/* CTA Button */}
          <div className="mt-10">
            <a
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-200 text-lg font-medium shadow-lg hover:shadow-xl hover:scale-105"
            >
              {t("home.registerButton")}
              <HiArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-20">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.key}
                className="group relative bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
              >
                {/* Icon */}
                <div
                  className={`w-14 h-14 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}
                >
                  <Icon className={`w-7 h-7 ${feature.color}`} />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-primary mb-2">
                  {t(`home.features.${feature.key}.title`)}
                </h3>

                {/* Description */}
                <p className="text-secondary text-sm leading-relaxed mb-4">
                  {t(`home.features.${feature.key}.description`)}
                </p>

                {/* Arrow Icon */}
                <div className="flex items-center text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-sm font-medium">Tìm hiểu thêm</span>
                  <HiArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                </div>

                {/* Hover Border Effect */}
                <div className="absolute inset-0 rounded-xl border-2 border-indigo-500/0 group-hover:border-indigo-500/50 transition-all duration-300 pointer-events-none" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Trusted By Section */}
      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title */}
          <p className="text-center text-sm font-medium text-secondary mb-8">
            {t("home.trusted.title")}
          </p>

          {/* Marquee - Auto scrolling logos */}
          <div className="relative overflow-hidden">
            <div className="flex animate-marquee">
              {/* First set */}
              {companies.map((company) => (
                <div
                  key={`first-${company.name}`}
                  className="flex-shrink-0 mx-4 px-6 py-3 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center gap-2 whitespace-nowrap"
                >
                  <span className="text-xl">{company.icon}</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {company.name}
                  </span>
                </div>
              ))}
              {/* Duplicate set for seamless loop */}
              {companies.map((company) => (
                <div
                  key={`second-${company.name}`}
                  className="flex-shrink-0 mx-4 px-6 py-3 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center gap-2 whitespace-nowrap"
                >
                  <span className="text-xl">{company.icon}</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {company.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 mb-6">
            <HiStar className="w-4 h-4 text-yellow-500" />
            {t("home.trusted.testimonials.tag")}
          </div>

          {/* Title */}
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-primary">
              {t("home.trusted.testimonials.title")}{" "}
            </span>
            <span className="text-indigo-600 dark:text-indigo-400">
              {t("home.trusted.testimonials.titleHighlight")}
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-lg text-secondary max-w-2xl mx-auto">
            {t("home.trusted.testimonials.subtitle")}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((num) => (
            <div
              key={num}
              className="relative bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              {/* Quote Icon */}
              <div className="absolute top-4 right-4 text-gray-200 dark:text-gray-700 text-6xl font-bold">
                <FaQuoteLeft className="w-12 h-12" />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }, (_, i) => (
                  <HiStar
                    key={`star-${i}`}
                    className="w-5 h-5 text-yellow-500 fill-yellow-500"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-secondary mb-6 relative z-10">
                {t(`home.trusted.testimonials.items.${num}.quote`)}
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 dark:bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                  {t(`home.trusted.testimonials.items.${num}.name`)
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-primary">
                    {t(`home.trusted.testimonials.items.${num}.name`)}
                  </p>
                  <p className="text-sm text-secondary">
                    {t(`home.trusted.testimonials.items.${num}.title`)} •{" "}
                    {t(`home.trusted.testimonials.items.${num}.company`)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Statistics Section */}
      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.key} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm md:text-base text-secondary">
                  {t(`home.trusted.stats.${stat.key}`)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
