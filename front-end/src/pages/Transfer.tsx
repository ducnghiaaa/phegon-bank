import { useState } from "react";
import { useTranslation } from "../contexts/LanguageContext";
import {
  HiSearch,
  HiArrowUp,
  HiArrowDown,
  HiCheckCircle,
  HiClock,
  HiXCircle,
} from "react-icons/hi";
import { formatCurrency } from "../utils/format";

interface Transaction {
  id: string;
  date: string;
  type: "sent" | "received";
  recipient: string;
  accountNumber: string;
  amount: number;
  status: "completed" | "pending" | "failed";
  description: string;
}

function Transfer() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "sent" | "received" | "pending">("all");

  // Mock data - sẽ thay thế bằng API call
  const transactions: Transaction[] = [
    {
      id: "1",
      date: new Date().toISOString(),
      type: "sent",
      recipient: "Nguyễn Văn A",
      accountNumber: "1234567890",
      amount: 5000000,
      status: "completed",
      description: "Chuyển tiền thanh toán hóa đơn",
    },
    {
      id: "2",
      date: new Date(Date.now() - 86400000).toISOString(),
      type: "received",
      recipient: "Trần Thị B",
      accountNumber: "0987654321",
      amount: 2000000,
      status: "completed",
      description: "Nhận tiền từ bạn bè",
    },
    {
      id: "3",
      date: new Date(Date.now() - 172800000).toISOString(),
      type: "sent",
      recipient: "Lê Văn C",
      accountNumber: "1122334455",
      amount: 10000000,
      status: "pending",
      description: "Chuyển tiền mua hàng",
    },
    {
      id: "4",
      date: new Date(Date.now() - 259200000).toISOString(),
      type: "sent",
      recipient: "Phạm Thị D",
      accountNumber: "5566778899",
      amount: 3000000,
      status: "failed",
      description: "Chuyển tiền không thành công",
    },
    {
      id: "5",
      date: new Date(Date.now() - 345600000).toISOString(),
      type: "received",
      recipient: "Hoàng Văn E",
      accountNumber: "9988776655",
      amount: 15000000,
      status: "completed",
      description: "Nhận lương tháng",
    },
  ];

  // Filter transactions
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.accountNumber.includes(searchQuery) ||
      transaction.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "sent" && transaction.type === "sent") ||
      (filter === "received" && transaction.type === "received") ||
      (filter === "pending" && transaction.status === "pending");

    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <HiCheckCircle className="w-5 h-5 text-green-500" />;
      case "pending":
        return <HiClock className="w-5 h-5 text-yellow-500" />;
      case "failed":
        return <HiXCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400";
      case "pending":
        return "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400";
      case "failed":
        return "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">
            {t("transfer.title")}
          </h1>
          <p className="text-secondary">{t("transfer.history")}</p>
        </div>

        {/* Search and Filter */}
        <div className="bg-surface rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("transfer.searchPlaceholder")}
                className="w-full pl-10 pr-4 py-2 input-base border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2 flex-wrap">
              {(["all", "sent", "received", "pending"] as const).map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    filter === filterType
                      ? "bg-indigo-600 dark:bg-indigo-500 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-secondary hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {t(`transfer.filter.${filterType}`)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="bg-surface rounded-xl shadow-md overflow-hidden">
          {filteredTransactions.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-secondary text-lg mb-2">
                {t("transfer.noTransactions")}
              </p>
              <p className="text-tertiary text-sm">
                {t("transfer.emptyState")}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800 border-b border-surface">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                      {t("transfer.table.date")}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                      {t("transfer.table.type")}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                      {t("transfer.table.recipient")}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                      {t("transfer.table.amount")}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                      {t("transfer.table.status")}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                      {t("transfer.table.description")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface">
                  {filteredTransactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-primary">
                          {new Date(transaction.date).toLocaleDateString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {transaction.type === "sent" ? (
                            <HiArrowUp className="w-4 h-4 text-red-500" />
                          ) : (
                            <HiArrowDown className="w-4 h-4 text-green-500" />
                          )}
                          <span className="text-sm text-secondary">
                            {t(`transfer.type.${transaction.type}`)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-primary font-medium">
                          {transaction.recipient}
                        </div>
                        <div className="text-xs text-tertiary">
                          {transaction.accountNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className={`text-sm font-semibold ${
                            transaction.type === "sent"
                              ? "text-red-600 dark:text-red-400"
                              : "text-green-600 dark:text-green-400"
                          }`}
                        >
                          {transaction.type === "sent" ? "-" : "+"}
                          {formatCurrency(transaction.amount)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(transaction.status)}
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(
                              transaction.status
                            )}`}
                          >
                            {t(`transfer.status.${transaction.status}`)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-secondary">
                          {transaction.description}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Transfer;
