import { useState, useEffect } from "react";
import { useTranslation } from "../contexts/LanguageContext";
import { userApi } from "../services/user.api";
import { transactionApi } from "../services/transaction.api";
import api from "../services/api";
import type { Account as ApiAccount, Transaction } from "../types/api.types";
import type { WalletAccount, TransactionType } from "../types/wallet.types";

export function useWallet() {
  const { t } = useTranslation();
  const [selectedAccount, setSelectedAccount] = useState<WalletAccount | null>(null);
  const [accounts, setAccounts] = useState<WalletAccount[]>([]);
  const [showBalance, setShowBalance] = useState<Record<string, boolean>>({});
  const [transactionType, setTransactionType] = useState<TransactionType>("transfer");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [transferAccountNumber, setTransferAccountNumber] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [showTransactionHistory, setShowTransactionHistory] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);

  // Map API Account to local Account format
  const mapApiAccountToLocal = (
    apiAccount: ApiAccount,
    userName: string
  ): WalletAccount => {
    // Map accountType to local type
    const type = apiAccount.accountType.toLowerCase().includes("savings")
      ? ("savings" as const)
      : ("checking" as const);

    // Generate account name based on type
    const accountName =
      type === "savings" ? t("wallet.savings") : t("wallet.checking");

    // Generate mock card number from account number (last 4 digits)
    const last4Digits = apiAccount.accountNumber.slice(-4);
    const cardNumber = `**** **** **** ${last4Digits}`;

    // Generate expiry date (2 years from now)
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 2);
    const formattedExpiry = `${String(expiryDate.getMonth() + 1).padStart(
      2,
      "0"
    )}/${String(expiryDate.getFullYear()).slice(-2)}`;

    return {
      id: apiAccount.id,
      accountNumber: apiAccount.accountNumber,
      accountName,
      balance: apiAccount.balance,
      type,
      cardNumber,
      expiryDate: formattedExpiry,
      userId: apiAccount.userId,
      userName,
    };
  };

  // Fetch user profile (includes accounts)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userResponse = await userApi.getMyProfile();
        const userData = userResponse.data.data;
        const fullName = `${userData.firstName} ${userData.lastName}`;
        setUserName(fullName);

        // Get accounts from user profile response
        const accountsData = userData.accounts || [];
        const mappedAccounts = accountsData.map((account) =>
          mapApiAccountToLocal(account, fullName)
        );
        setAccounts(mappedAccounts);

        // Auto-select first account if available
        if (mappedAccounts.length > 0) {
          setSelectedAccount(mappedAccounts[0]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrors((prev) => ({
          ...prev,
          general: t("wallet.error.fetchFailed") || "Không thể tải dữ liệu",
        }));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [t]);

  // Refresh all data after transaction
  const refreshAllData = async () => {
    try {
      // Fetch user profile to get all updated accounts
      const userResponse = await userApi.getMyProfile();
      const userData = userResponse.data.data;
      const fullName = `${userData.firstName} ${userData.lastName}`;
      setUserName(fullName);

      // Get accounts from user profile response
      const accountsData = userData.accounts || [];
      const mappedAccounts = accountsData.map((account) =>
        mapApiAccountToLocal(account, fullName)
      );
      setAccounts(mappedAccounts);

      // Store the account number to refresh transaction history if needed
      const previousAccountNumber = selectedAccount?.accountNumber;

      // Update selected account if it still exists
      if (selectedAccount) {
        const updatedSelectedAccount = mappedAccounts.find(
          (acc) => acc.accountNumber === selectedAccount.accountNumber
        );
        if (updatedSelectedAccount) {
          setSelectedAccount(updatedSelectedAccount);

          // Refresh transaction history if it's currently shown
          if (showTransactionHistory && previousAccountNumber) {
            await fetchTransactionHistory(previousAccountNumber);
          }
        } else if (mappedAccounts.length > 0) {
          // If selected account no longer exists, select first account
          setSelectedAccount(mappedAccounts[0]);
          if (showTransactionHistory) {
            await fetchTransactionHistory(mappedAccounts[0].accountNumber);
          }
        }
      } else if (mappedAccounts.length > 0) {
        // If no account was selected, select first one
        setSelectedAccount(mappedAccounts[0]);
      }
    } catch (error) {
      console.error("Error refreshing all data:", error);
    }
  };

  // Fetch transaction history
  const fetchTransactionHistory = async (accountNumber?: string) => {
    const targetAccountNumber = accountNumber || selectedAccount?.accountNumber;

    if (!targetAccountNumber) return;

    try {
      setLoadingTransactions(true);
      const response = await transactionApi.getTransactions(
        targetAccountNumber,
        0,
        50
      );
      // Handle both response formats: array directly or wrapped in content object
      let transactionsData: Transaction[] = [];
      const responseData = response.data as any;

      if (Array.isArray(responseData)) {
        // API returns array directly
        transactionsData = responseData;
      } else if (responseData && typeof responseData === "object") {
        // API returns PaginatedResponse with content property
        if (Array.isArray(responseData.content)) {
          transactionsData = responseData.content;
        } else if (Array.isArray(responseData.data)) {
          // Fallback: check for data property (if API wraps differently)
          transactionsData = responseData.data;
        } else if (Array.isArray(responseData.transactions)) {
          // Fallback: check for transactions property
          transactionsData = responseData.transactions;
        }
      }

      setTransactions(transactionsData);
      setShowTransactionHistory(true);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setErrors((prev) => ({
        ...prev,
        transactions:
          t("wallet.error.fetchTransactionsFailed") ||
          "Không thể tải lịch sử giao dịch",
      }));
    } finally {
      setLoadingTransactions(false);
    }
  };

  const handleViewStatement = () => {
    if (showTransactionHistory) {
      setShowTransactionHistory(false);
    } else {
      fetchTransactionHistory();
    }
  };

  const formatTransactionType = (type: string) => {
    switch (type) {
      case "TRANSFER":
        return t("wallet.transactionType.transfer") || "Chuyển tiền";
      case "WITHDRAWAL":
        return t("wallet.transactionType.withdrawal") || "Rút tiền";
      case "DEPOSIT":
        return t("wallet.transactionType.deposit") || "Nạp tiền";
      default:
        return type;
    }
  };

  const formatTransactionStatus = (status: string) => {
    switch (status) {
      case "COMPLETED":
      case "SUCCESS":
        return {
          text: t("wallet.transactionStatus.completed") || "Thành công",
          color: "text-green-600 dark:text-green-400",
        };
      case "PENDING":
        return {
          text: t("wallet.transactionStatus.pending") || "Đang xử lý",
          color: "text-yellow-600 dark:text-yellow-400",
        };
      case "FAILED":
        return {
          text: t("wallet.transactionStatus.failed") || "Thất bại",
          color: "text-red-600 dark:text-red-400",
        };
      default:
        return { text: status, color: "text-gray-600 dark:text-gray-400" };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const toggleBalanceVisibility = (accountId: string) => {
    setShowBalance((prev) => ({
      ...prev,
      [accountId]: !prev[accountId],
    }));
  };

  const handleAccountClick = (account: WalletAccount) => {
    setSelectedAccount(account);
    setShowSuccess(false);
    setErrors({});
    setAmount("");
    setDescription("");
    setTransferAccountNumber("");
  };

  const validateAmount = () => {
    const numAmount = Number(amount);
    if (!amount) {
      setErrors((prev) => ({
        ...prev,
        amount: t("wallet.amountInfo.amountRequired"),
      }));
      return false;
    }
    if (numAmount < 1000) {
      setErrors((prev) => ({
        ...prev,
        amount: t("wallet.amountInfo.amountMin"),
      }));
      return false;
    }
    // Check if amount exceeds balance for transfer and withdraw
    if (selectedAccount && numAmount > selectedAccount.balance) {
      setErrors((prev) => ({
        ...prev,
        amount: t("wallet.amountInfo.insufficientBalance") || "Số dư không đủ",
      }));
      return false;
    }
    setErrors((prev) => ({ ...prev, amount: "" }));
    return true;
  };

  const validateDescription = () => {
    // Description is optional for transfer, required for withdraw
    if (transactionType === "withdraw" && !description.trim()) {
      setErrors((prev) => ({
        ...prev,
        description: t("wallet.amountInfo.descriptionRequired"),
      }));
      return false;
    }
    setErrors((prev) => ({ ...prev, description: "" }));
    return true;
  };

  const validateTransferAccount = () => {
    if (!transferAccountNumber.trim()) {
      setErrors((prev) => ({
        ...prev,
        transferAccount:
          t("wallet.transfer.accountRequired") ||
          "Vui lòng nhập số tài khoản nhận",
      }));
      return false;
    }
    if (transferAccountNumber === selectedAccount?.accountNumber) {
      setErrors((prev) => ({
        ...prev,
        transferAccount:
          t("wallet.transfer.sameAccount") ||
          "Không thể chuyển tiền cho chính tài khoản này",
      }));
      return false;
    }
    setErrors((prev) => ({ ...prev, transferAccount: "" }));
    return true;
  };

  const handleAmountBlur = () => {
    validateAmount();
  };

  const handleDescriptionBlur = () => {
    validateDescription();
  };

  const handleTransferAccountBlur = () => {
    if (transactionType === "transfer") {
      validateTransferAccount();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isAmountValid = validateAmount();
    const isDescriptionValid = validateDescription();
    const isTransferAccountValid =
      transactionType === "transfer" ? validateTransferAccount() : true;

    if (!isAmountValid || !isDescriptionValid || !isTransferAccountValid) {
      return;
    }

    if (!selectedAccount) {
      setErrors((prev) => ({
        ...prev,
        general:
          t("wallet.error.noAccountSelected") || "Vui lòng chọn tài khoản",
      }));
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      if (transactionType === "transfer") {
        // Handle transfer - format: { transactionType: "TRANSFER", amount, accountNumber, destinationAccountNumber, description }
        await api.post("/transactions", {
          transactionType: "TRANSFER",
          amount: Number(amount),
          accountNumber: selectedAccount.accountNumber,
          destinationAccountNumber: transferAccountNumber,
          description: description || undefined,
        });
      } else {
        // Handle withdrawal - format: { transactionType: "WITHDRAWAL", amount, accountNumber, description }
        await api.post("/transactions", {
          transactionType: "WITHDRAWAL",
          amount: Number(amount),
          accountNumber: selectedAccount.accountNumber,
          description: description,
        });
      }

      // Refresh all data (accounts, balances, transaction history)
      await refreshAllData();

      setShowSuccess(true);
      setAmount("");
      setDescription("");
      setTransferAccountNumber("");

      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (error: any) {
      console.error("Transaction error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        (transactionType === "transfer"
          ? t("wallet.error.transferFailed") || "Chuyển tiền thất bại"
          : t("wallet.error.withdrawFailed") || "Rút tiền thất bại");

      setErrors((prev) => ({
        ...prev,
        general: errorMessage,
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleTransactionTypeChange = (type: TransactionType) => {
    setTransactionType(type);
    setShowSuccess(false);
    setErrors({});
    if (type === "withdraw") {
      setTransferAccountNumber("");
    }
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
    if (errors.amount) {
      setErrors((prev) => ({ ...prev, amount: "" }));
    }
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    if (errors.description) {
      setErrors((prev) => ({ ...prev, description: "" }));
    }
  };

  const handleTransferAccountChange = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    setTransferAccountNumber(numericValue);
    if (errors.transferAccount) {
      setErrors((prev) => ({ ...prev, transferAccount: "" }));
    }
  };

  // Computed values for submit button
  const submitButtonClassName = loading
    ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
    : transactionType === "transfer"
    ? "bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600"
    : "bg-red-600 dark:bg-red-500 hover:bg-red-700 dark:hover:bg-red-600";

  const submitButtonText = loading
    ? t("wallet.processing") || "Đang xử lý..."
    : transactionType === "transfer"
    ? t("wallet.transferButton") || "Chuyển tiền"
    : t("wallet.withdrawButton");

  return {
    // State
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
    userName,
    showTransactionHistory,
    transactions,
    loadingTransactions,
    submitButtonClassName,
    submitButtonText,
    // Actions
    setAmount: handleAmountChange,
    setDescription: handleDescriptionChange,
    setTransferAccountNumber: handleTransferAccountChange,
    setTransactionType: handleTransactionTypeChange,
    toggleBalanceVisibility,
    handleAccountClick,
    handleAmountBlur,
    handleDescriptionBlur,
    handleTransferAccountBlur,
    handleSubmit,
    handleViewStatement,
    // Formatters
    formatTransactionType,
    formatTransactionStatus,
    formatDate,
  };
}

