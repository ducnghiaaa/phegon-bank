import { useState } from "react";
import { useTranslation } from "../contexts/LanguageContext";
import {
  HiCreditCard,
  HiArrowDown,
  HiArrowUp,
  HiEye,
  HiEyeOff,
  HiCheckCircle,
} from "react-icons/hi";
import { formatCurrency } from "../utils/format";

interface Account {
  id: string;
  accountNumber: string;
  accountName: string;
  balance: number;
  type: "savings" | "checking";
  cardNumber: string;
  expiryDate: string;
  userId: string;
  userName: string;
}

function Wallet() {
  const { t } = useTranslation();
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [showBalance, setShowBalance] = useState<Record<string, boolean>>({});
  const [transactionType, setTransactionType] = useState<"deposit" | "withdraw">("deposit");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [depositMethod, setDepositMethod] = useState<"bankTransfer" | "ewallet" | "cash" | "qr" | "card">("bankTransfer");
  const [withdrawMethod, setWithdrawMethod] = useState<"bankTransfer" | "cash">("bankTransfer");
  const [otp, setOtp] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Mock data - sẽ thay thế bằng API call
  const accounts: Account[] = [
    {
      id: "1",
      accountNumber: "1234567890",
      accountName: "Tài khoản thanh toán",
      balance: 50000000,
      type: "checking",
      cardNumber: "1234 5678 9012 3456",
      expiryDate: "12/25",
      userId: "KH001",
      userName: "Nguyễn Văn A",
    },
    {
      id: "2",
      accountNumber: "0987654321",
      accountName: "Tài khoản tiết kiệm",
      balance: 200000000,
      type: "savings",
      cardNumber: "9876 5432 1098 7654",
      expiryDate: "06/26",
      userId: "KH001",
      userName: "Nguyễn Văn A",
    },
  ];

  // Bank info for deposit
  const bankInfo = {
    bankName: "Phegon Bank",
    accountNumber: "9999999999",
    accountName: "CÔNG TY PHEGON BANK",
    referenceCode: selectedAccount ? `DEP${selectedAccount.userId}${Date.now()}` : "",
  };

  // Withdrawal fee (1% of amount)
  const withdrawalFee = amount ? Math.round(Number(amount) * 0.01) : 0;
  const receiveAmount = amount ? Number(amount) - withdrawalFee : 0;

  const toggleBalanceVisibility = (accountId: string) => {
    setShowBalance((prev) => ({
      ...prev,
      [accountId]: !prev[accountId],
    }));
  };

  const handleAccountClick = (account: Account) => {
    setSelectedAccount(account);
    setShowSuccess(false);
    setErrors({});
    setAmount("");
    setDescription("");
    setOtp("");
  };

  const validateAmount = () => {
    const numAmount = Number(amount);
    if (!amount) {
      setErrors((prev) => ({ ...prev, amount: t("wallet.amountInfo.amountRequired") }));
      return false;
    }
    if (numAmount < 1000) {
      setErrors((prev) => ({ ...prev, amount: t("wallet.amountInfo.amountMin") }));
      return false;
    }
    setErrors((prev) => ({ ...prev, amount: "" }));
    return true;
  };

  const validateDescription = () => {
    if (!description.trim()) {
      setErrors((prev) => ({ ...prev, description: t("wallet.amountInfo.descriptionRequired") }));
      return false;
    }
    setErrors((prev) => ({ ...prev, description: "" }));
    return true;
  };

  const handleAmountBlur = () => {
    validateAmount();
    if (transactionType === "withdraw") {
      validateDescription();
    }
  };

  const handleDescriptionBlur = () => {
    if (transactionType === "withdraw") {
      validateDescription();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isAmountValid = validateAmount();
    const isDescriptionValid = transactionType === "withdraw" ? validateDescription() : true;
    const isOtpValid = transactionType === "withdraw" ? otp.length === 6 : true;

    if (!isAmountValid || !isDescriptionValid || !isOtpValid) {
      return;
    }

    // Xử lý nạp/rút tiền với API
    console.log("Transaction:", {
      accountId: selectedAccount?.id,
      type: transactionType,
      amount,
      description,
      method: transactionType === "deposit" ? depositMethod : withdrawMethod,
      otp: transactionType === "withdraw" ? otp : undefined,
    });
    setShowSuccess(true);
    setAmount("");
    setDescription("");
    setOtp("");
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">
            {t("wallet.title")}
          </h1>
          <p className="text-secondary">{t("wallet.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Accounts List */}
          <div className="lg:col-span-1">
            <div className="bg-surface rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-primary mb-4">
                {t("wallet.accounts")}
              </h2>
              <div className="space-y-4">
                {accounts.map((account) => (
                  <button
                    key={account.id}
                    onClick={() => handleAccountClick(account)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                      selectedAccount?.id === account.id
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 shadow-md"
                        : "border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-indigo-600 dark:bg-indigo-500 rounded-lg flex items-center justify-center">
                          <HiCreditCard className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-primary">
                            {account.accountName}
                          </h3>
                          <p className="text-xs text-tertiary">
                            {account.accountNumber}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBalanceVisibility(account.id);
                        }}
                        className="text-tertiary hover:text-primary transition-colors"
                      >
                        {showBalance[account.id] ? (
                          <HiEyeOff className="w-5 h-5" />
                        ) : (
                          <HiEye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-tertiary mb-1">
                          {t("wallet.balance")}
                        </p>
                        <p className="text-lg font-bold text-primary">
                          {showBalance[account.id]
                            ? formatCurrency(account.balance)
                            : "••••••••"}
                        </p>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          account.type === "savings"
                            ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                            : "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                        }`}
                      >
                        {account.type === "savings"
                          ? t("wallet.savings")
                          : t("wallet.checking")}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Account Details & Transaction Form */}
          <div className="lg:col-span-2">
            {selectedAccount ? (
              <div className="space-y-6">
                {/* Account Details Card */}
                <div className="bg-surface rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-bold text-primary mb-4">
                    {t("wallet.accountDetails")}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-tertiary mb-1">
                        {t("wallet.accountName")}
                      </p>
                      <p className="text-base font-semibold text-primary">
                        {selectedAccount.accountName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-tertiary mb-1">
                        {t("wallet.accountNumber")}
                      </p>
                      <p className="text-base font-semibold text-primary">
                        {selectedAccount.accountNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-tertiary mb-1">
                        {t("wallet.cardNumber")}
                      </p>
                      <p className="text-base font-semibold text-primary">
                        {selectedAccount.cardNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-tertiary mb-1">
                        {t("wallet.expiryDate")}
                      </p>
                      <p className="text-base font-semibold text-primary">
                        {selectedAccount.expiryDate}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-tertiary mb-1">
                        {t("wallet.currentBalance")}
                      </p>
                      <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                        {showBalance[selectedAccount.id]
                          ? formatCurrency(selectedAccount.balance)
                          : "••••••••"}
                      </p>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="mt-6 pt-6 border-t border-surface">
                    <p className="text-sm text-tertiary mb-3">
                      {t("wallet.quickActions")}
                    </p>
                    <div className="flex gap-3 flex-wrap">
                      <button className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-900/30 transition-colors text-sm font-medium">
                        {t("wallet.viewStatement")}
                      </button>
                      <button className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-900/30 transition-colors text-sm font-medium">
                        {t("wallet.transfer")}
                      </button>
                      <button className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-900/30 transition-colors text-sm font-medium">
                        {t("wallet.settings")}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Transaction Form */}
                <div className="bg-surface rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-bold text-primary mb-4">
                    {t("wallet.transaction")}
                  </h2>

                  {/* Transaction Type Toggle */}
                  <div className="flex gap-2 mb-6">
                    <button
                      type="button"
                      onClick={() => {
                        setTransactionType("deposit");
                        setShowSuccess(false);
                        setErrors({});
                      }}
                      className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                        transactionType === "deposit"
                          ? "bg-green-600 dark:bg-green-500 text-white shadow-md"
                          : "bg-gray-100 dark:bg-gray-700 text-secondary hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <HiArrowDown className="w-5 h-5" />
                        {t("wallet.depositLabel")}
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTransactionType("withdraw");
                        setShowSuccess(false);
                        setErrors({});
                      }}
                      className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                        transactionType === "withdraw"
                          ? "bg-red-600 dark:bg-red-500 text-white shadow-md"
                          : "bg-gray-100 dark:bg-gray-700 text-secondary hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <HiArrowUp className="w-5 h-5" />
                        {t("wallet.withdrawLabel")}
                      </div>
                    </button>
                  </div>

                  {/* Success Message */}
                  {showSuccess && (
                    <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-3">
                      <HiCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <p className="text-sm text-green-700 dark:text-green-400">
                        {t("wallet.successMessage")}
                      </p>
                    </div>
                  )}

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* User Info */}
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                      <h3 className="text-sm font-semibold text-primary mb-3">
                        {t("wallet.userInfo.title")}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-tertiary mb-1">
                            {t("wallet.userInfo.userName")}
                          </p>
                          <p className="text-sm font-medium text-primary">
                            {selectedAccount.userName}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-tertiary mb-1">
                            {t("wallet.userInfo.userId")}
                          </p>
                          <p className="text-sm font-medium text-primary">
                            {selectedAccount.userId}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-tertiary mb-1">
                            {t("wallet.userInfo.currentBalance")}
                          </p>
                          <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                            {showBalance[selectedAccount.id]
                              ? formatCurrency(selectedAccount.balance)
                              : "••••••••"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Amount Info */}
                    <div>
                      <h3 className="text-sm font-semibold text-primary mb-3">
                        {t("wallet.amountInfo.title")}
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-secondary mb-2">
                            {t("wallet.amountInfo.amount")} <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              value={amount}
                              onChange={(e) => {
                                setAmount(e.target.value);
                                if (errors.amount) {
                                  setErrors((prev) => ({ ...prev, amount: "" }));
                                }
                              }}
                              onBlur={handleAmountBlur}
                              placeholder={t("wallet.amountPlaceholder")}
                              className={`w-full px-4 py-3 pr-16 input-base border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                                errors.amount ? "border-red-500" : ""
                              }`}
                              required
                              min="1000"
                              step="1000"
                            />
                            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-tertiary">
                              VND
                            </span>
                          </div>
                          {errors.amount && (
                            <p className="mt-1 text-sm text-red-500">{errors.amount}</p>
                          )}
                          <p className="mt-1 text-xs text-tertiary">
                            {t("wallet.minAmount")}: {formatCurrency(1000)}
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-secondary mb-2">
                            {t("wallet.amountInfo.description")}{" "}
                            {transactionType === "withdraw" && (
                              <span className="text-red-500">*</span>
                            )}
                          </label>
                          <input
                            type="text"
                            value={description}
                            onChange={(e) => {
                              setDescription(e.target.value);
                              if (errors.description) {
                                setErrors((prev) => ({ ...prev, description: "" }));
                              }
                            }}
                            onBlur={handleDescriptionBlur}
                            placeholder={t("wallet.descriptionPlaceholder")}
                            className={`w-full px-4 py-3 input-base border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                              errors.description ? "border-red-500" : ""
                            }`}
                            required={transactionType === "withdraw"}
                          />
                          {errors.description && (
                            <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                          )}
                        </div>

                        {/* Withdrawal Fee & Receive Amount */}
                        {transactionType === "withdraw" && amount && Number(amount) >= 1000 && (
                          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-secondary">{t("wallet.withdraw.fee")}:</span>
                              <span className="font-medium text-primary">
                                {formatCurrency(withdrawalFee)}
                              </span>
                            </div>
                            <div className="flex justify-between text-base font-semibold">
                              <span className="text-primary">
                                {t("wallet.withdraw.receiveAmount")}:
                              </span>
                              <span className="text-green-600 dark:text-green-400">
                                {formatCurrency(receiveAmount)}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Deposit Methods */}
                    {transactionType === "deposit" && (
                      <div>
                        <h3 className="text-sm font-semibold text-primary mb-3">
                          {t("wallet.deposit.methods.title")}
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {(["bankTransfer", "ewallet", "cash", "qr", "card"] as const).map(
                            (method) => (
                              <button
                                key={method}
                                type="button"
                                onClick={() => setDepositMethod(method)}
                                className={`p-3 rounded-lg border-2 text-sm font-medium transition-all duration-200 ${
                                  depositMethod === method
                                    ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"
                                    : "border-gray-200 dark:border-gray-700 text-secondary hover:border-indigo-300 dark:hover:border-indigo-700"
                                }`}
                              >
                                {t(`wallet.deposit.methods.${method}`)}
                              </button>
                            )
                          )}
                        </div>

                        {/* Bank Transfer Info */}
                        {depositMethod === "bankTransfer" && (
                          <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                            <h4 className="text-sm font-semibold text-primary mb-3">
                              {t("wallet.deposit.bankInfo.title")}
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-tertiary">
                                  {t("wallet.deposit.bankInfo.bankName")}:
                                </span>
                                <span className="font-medium text-primary">{bankInfo.bankName}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-tertiary">
                                  {t("wallet.deposit.bankInfo.accountNumber")}:
                                </span>
                                <span className="font-medium text-primary font-mono">
                                  {bankInfo.accountNumber}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-tertiary">
                                  {t("wallet.deposit.bankInfo.accountName")}:
                                </span>
                                <span className="font-medium text-primary">
                                  {bankInfo.accountName}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-tertiary">
                                  {t("wallet.deposit.bankInfo.referenceCode")}:
                                </span>
                                <span className="font-medium text-indigo-600 dark:text-indigo-400 font-mono">
                                  {bankInfo.referenceCode}
                                </span>
                              </div>
                              <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-800">
                                <p className="text-xs text-tertiary">
                                  {t("wallet.deposit.bankInfo.note")}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Withdraw Methods */}
                    {transactionType === "withdraw" && (
                      <div>
                        <h3 className="text-sm font-semibold text-primary mb-3">
                          {t("wallet.withdraw.methods.title")}
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                          {(["bankTransfer", "cash"] as const).map((method) => (
                            <button
                              key={method}
                              type="button"
                              onClick={() => setWithdrawMethod(method)}
                              className={`p-3 rounded-lg border-2 text-sm font-medium transition-all duration-200 ${
                                withdrawMethod === method
                                  ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"
                                  : "border-gray-200 dark:border-gray-700 text-secondary hover:border-indigo-300 dark:hover:border-indigo-700"
                              }`}
                            >
                              {t(`wallet.withdraw.methods.${method}`)}
                            </button>
                          ))}
                        </div>

                        {/* Bank Account Info for Withdrawal */}
                        {withdrawMethod === "bankTransfer" && (
                          <div className="mt-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 space-y-3">
                            <h4 className="text-sm font-semibold text-primary">
                              {t("wallet.withdraw.bankInfo.title")}
                            </h4>
                            <div>
                              <label className="block text-xs text-tertiary mb-1">
                                {t("wallet.withdraw.bankInfo.bankName")} <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                placeholder="VD: Vietcombank, Techcombank..."
                                className="w-full px-3 py-2 input-base border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-tertiary mb-1">
                                {t("wallet.withdraw.bankInfo.accountNumber")} <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                placeholder="Nhập số tài khoản nhận tiền"
                                className="w-full px-3 py-2 input-base border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm font-mono"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-tertiary mb-1">
                                {t("wallet.withdraw.bankInfo.accountName")} <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                placeholder="Tên chủ tài khoản"
                                className="w-full px-3 py-2 input-base border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                                required
                              />
                            </div>
                          </div>
                        )}

                        {/* OTP */}
                        <div>
                          <label className="block text-sm font-medium text-secondary mb-2">
                            {t("wallet.withdraw.otp.label")} <span className="text-red-500">*</span>
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={otp}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                                setOtp(value);
                              }}
                              placeholder={t("wallet.withdraw.otp.placeholder")}
                              className="flex-1 px-4 py-3 input-base border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-center text-lg font-mono tracking-widest"
                              required
                              maxLength={6}
                            />
                            <button
                              type="button"
                              className="px-4 py-3 bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-900/30 transition-colors text-sm font-medium whitespace-nowrap"
                            >
                              {t("wallet.withdraw.otp.send")}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      className={`w-full px-4 py-3 rounded-lg font-medium text-white transition-all duration-200 ${
                        transactionType === "deposit"
                          ? "bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600"
                          : "bg-red-600 dark:bg-red-500 hover:bg-red-700 dark:hover:bg-red-600"
                      }`}
                    >
                      {transactionType === "deposit"
                        ? t("wallet.depositButton")
                        : t("wallet.withdrawButton")}
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="bg-surface rounded-xl shadow-md p-12 text-center">
                <HiCreditCard className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-lg text-secondary mb-2">
                  {t("wallet.selectAccount")}
                </p>
                <p className="text-sm text-tertiary">
                  {t("wallet.selectAccountHint")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Wallet;
