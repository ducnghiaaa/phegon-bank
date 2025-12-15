import api from "./api";
import type {
  Transaction,
  TransferRequest,
  DepositRequest,
  WithdrawalRequest,
  PaginatedResponse,
} from "../types/api.types";

export const transactionApi = {
  // Make a transfer
  makeTransfer: (transferData: TransferRequest) =>
    api.post<Transaction>("/transactions", transferData),

  // Make a deposit
  makeDeposit: (depositData: DepositRequest) =>
    api.post<Transaction>("/transactions", depositData),

  // Make a withdrawal
  makeWithdrawal: (withdrawalData: WithdrawalRequest) =>
    api.post<Transaction>("/transactions", withdrawalData),

  // Get transactions for an account
  getTransactions: (accountNumber: string, page: number = 0, size: number = 10) =>
    api.get<PaginatedResponse<Transaction>>(
      `/transactions/${accountNumber}?page=${page}&size=${size}`
    ),
};

