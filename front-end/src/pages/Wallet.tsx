import { useTranslation } from "../contexts/LanguageContext";
import {
  HiCreditCard,
  HiArrowDown,
  HiArrowRight,
  HiEye,
  HiEyeOff,
  HiCheckCircle,
} from "react-icons/hi";
import { formatCurrency } from "../utils/format";
import { useWallet } from "../hooks/useWallet";
import type { Transaction } from "../types/api.types";

function Wallet() {
  const { t } = useTranslation();
  const {
    selectedAccount,
    accounts,
    showBalance,
    transactionType,
    amount,
    description,
    transferAccountNumber,
    showSuccess,
    errors,
    loading,
    showTransactionHistory,
    transactions,
    loadingTransactions,
    submitButtonClassName,
    submitButtonText,
    setAmount,
    setDescription,
    setTransferAccountNumber,
    setTransactionType,
    toggleBalanceVisibility,
    handleAccountClick,
    handleAmountBlur,
    handleDescriptionBlur,
    handleTransferAccountBlur,
    handleSubmit,
    handleViewStatement,
    formatTransactionType,
    formatTransactionStatus,
    formatDate,
  } = useWallet();

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
                      <button
                        onClick={handleViewStatement}
                        className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                          showTransactionHistory
                            ? "bg-indigo-600 dark:bg-indigo-500 text-white"
                            : "bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-900/30"
                        }`}
                      >
                        {showTransactionHistory
                          ? t("wallet.hideStatement") || "Ẩn lịch sử"
                          : t("wallet.viewStatement")}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Transaction History */}
                {showTransactionHistory && (
                  <div className="bg-surface rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-bold text-primary mb-4">
                      {t("wallet.transactionHistory") || "Lịch sử giao dịch"}
                    </h2>
                    {loadingTransactions ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400 mx-auto mb-2"></div>
                        <p className="text-sm text-tertiary">
                          {t("wallet.loading") || "Đang tải..."}
                        </p>
                      </div>
                    ) : transactions.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-secondary">
                          {t("wallet.noTransactions") ||
                            "Chưa có giao dịch nào"}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {transactions.map((transaction: Transaction) => {
                          const statusInfo = formatTransactionStatus(
                            transaction.status
                          );

                          // Get account numbers from transaction
                          const sourceAccount =
                            transaction.sourceAccount ||
                            transaction.accountNumber;
                          const destinationAccount =
                            transaction.destinationAccount ||
                            transaction.recipientAccountNumber;
                          const currentAccountNumber =
                            selectedAccount?.accountNumber;

                          // Determine if transaction is outgoing based on sourceAccount
                          // For TRANSFER: outgoing if sourceAccount matches selectedAccount, incoming if destinationAccount matches
                          // For WITHDRAWAL: always outgoing (money goes out)
                          // For DEPOSIT: always incoming (money comes in)
                          let isOutgoing = false;
                          if (transaction.transactionType === "WITHDRAWAL") {
                            isOutgoing = true;
                          } else if (
                            transaction.transactionType === "DEPOSIT"
                          ) {
                            isOutgoing = false;
                          } else if (
                            transaction.transactionType === "TRANSFER"
                          ) {
                            // For TRANSFER: check if current account is source (outgoing) or destination (incoming)
                            if (
                              currentAccountNumber &&
                              sourceAccount === currentAccountNumber
                            ) {
                              isOutgoing = true;
                            } else if (
                              currentAccountNumber &&
                              destinationAccount === currentAccountNumber
                            ) {
                              isOutgoing = false;
                            } else {
                              // Fallback: if sourceAccount exists, assume outgoing
                              isOutgoing = !!sourceAccount;
                            }
                          }

                          // Get transaction date (support both formats)
                          const transactionDate =
                            transaction.transactionDate ||
                            transaction.createdAt ||
                            "";

                          return (
                            <div
                              key={transaction.id}
                              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-primary">
                                      {formatTransactionType(
                                        transaction.transactionType
                                      )}
                                    </span>
                                    <span
                                      className={`text-xs px-2 py-1 rounded-full ${statusInfo.color} bg-opacity-10`}
                                    >
                                      {statusInfo.text}
                                    </span>
                                  </div>
                                  {transaction.description && (
                                    <p className="text-sm text-tertiary mb-1">
                                      {transaction.description}
                                    </p>
                                  )}
                                  {transaction.transactionType ===
                                    "TRANSFER" && (
                                    <>
                                      {isOutgoing && destinationAccount && (
                                        <p className="text-xs text-tertiary">
                                          {t("wallet.toAccount") ||
                                            "Đến tài khoản"}
                                          : {destinationAccount}
                                        </p>
                                      )}
                                      {!isOutgoing && sourceAccount && (
                                        <p className="text-xs text-tertiary">
                                          {t("wallet.fromAccount") ||
                                            "Từ tài khoản"}
                                          : {sourceAccount}
                                        </p>
                                      )}
                                    </>
                                  )}
                                </div>
                                <div className="text-right">
                                  <p
                                    className={`text-lg font-bold ${
                                      isOutgoing
                                        ? "text-red-600 dark:text-red-400"
                                        : "text-green-600 dark:text-green-400"
                                    }`}
                                  >
                                    {isOutgoing ? "-" : "+"}
                                    {formatCurrency(transaction.amount)}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center justify-between text-xs text-tertiary pt-2 border-t border-gray-200 dark:border-gray-700">
                                <span>
                                  {transactionDate
                                    ? formatDate(transactionDate)
                                    : ""}
                                </span>
                                <span>
                                  {t("wallet.accountNumber")}:{" "}
                                  {currentAccountNumber ||
                                    sourceAccount ||
                                    transaction.accountNumber ||
                                    ""}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Transaction Form */}
                <div className="bg-surface rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-bold text-primary mb-4">
                    {t("wallet.transaction")}
                  </h2>

                  {/* Transaction Type Toggle */}
                  <div className="flex gap-2 mb-6">
                    <button
                      type="button"
                      onClick={() => setTransactionType("transfer")}
                      className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                        transactionType === "transfer"
                          ? "bg-blue-600 dark:bg-blue-500 text-white shadow-md"
                          : "bg-gray-100 dark:bg-gray-700 text-secondary hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <HiArrowRight className="w-5 h-5" />
                        {t("wallet.transferLabel") || "Chuyển tiền"}
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTransactionType("withdraw")}
                      className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                        transactionType === "withdraw"
                          ? "bg-red-600 dark:bg-red-500 text-white shadow-md"
                          : "bg-gray-100 dark:bg-gray-700 text-secondary hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <HiArrowDown className="w-5 h-5" />
                        {t("wallet.withdrawLabel")}
                      </div>
                    </button>
                  </div>

                  {/* Error Message */}
                  {errors.general && (
                    <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <p className="text-sm text-red-700 dark:text-red-400">
                        {errors.general}
                      </p>
                    </div>
                  )}

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
                            {t("wallet.amountInfo.amount")}{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              value={amount}
                              onChange={(e) => setAmount(e.target.value)}
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
                            <p className="mt-1 text-sm text-red-500">
                              {errors.amount}
                            </p>
                          )}
                          <p className="mt-1 text-xs text-tertiary">
                            {t("wallet.minAmount")}: {formatCurrency(1000)}
                          </p>
                        </div>

                        {/* Transfer Account Number */}
                        {transactionType === "transfer" && (
                          <div>
                            <label className="block text-sm font-medium text-secondary mb-2">
                              {t("wallet.transfer.toAccount") ||
                                "Số tài khoản nhận"}{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={transferAccountNumber}
                              onChange={(e) => setTransferAccountNumber(e.target.value)}
                              onBlur={handleTransferAccountBlur}
                              placeholder={
                                t("wallet.transfer.toAccountPlaceholder") ||
                                "Nhập số tài khoản nhận tiền"
                              }
                              className={`w-full px-4 py-3 input-base border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono ${
                                errors.transferAccount ? "border-red-500" : ""
                              }`}
                              required
                            />
                            {errors.transferAccount && (
                              <p className="mt-1 text-sm text-red-500">
                                {errors.transferAccount}
                              </p>
                            )}
                          </div>
                        )}

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
                            onChange={(e) => setDescription(e.target.value)}
                            onBlur={handleDescriptionBlur}
                            placeholder={t("wallet.descriptionPlaceholder")}
                            className={`w-full px-4 py-3 input-base border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                              errors.description ? "border-red-500" : ""
                            }`}
                            required={transactionType === "withdraw"}
                          />
                          {errors.description && (
                            <p className="mt-1 text-sm text-red-500">
                              {errors.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full px-4 py-3 rounded-lg font-medium text-white transition-all duration-200 ${submitButtonClassName}`}
                    >
                      {submitButtonText}
                    </button>
                  </form>
                </div>
              </div>
            ) : loading ? (
              <div className="bg-surface rounded-xl shadow-md p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400 mx-auto mb-4"></div>
                <p className="text-lg text-secondary">
                  {t("wallet.loading") || "Đang tải..."}
                </p>
              </div>
            ) : accounts.length === 0 ? (
              <div className="bg-surface rounded-xl shadow-md p-12 text-center">
                <HiCreditCard className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-lg text-secondary mb-2">
                  {t("wallet.noAccounts") || "Bạn chưa có tài khoản nào"}
                </p>
                <p className="text-sm text-tertiary">
                  {t("wallet.noAccountsHint") ||
                    "Vui lòng liên hệ ngân hàng để mở tài khoản"}
                </p>
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
