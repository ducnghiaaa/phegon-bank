import api from "./api";
import type {
  SystemTotals,
  User,
  Account,
  Transaction,
} from "../types/api.types";

export const auditApi = {
  // Get system totals
  getSystemTotals: () =>
    api.get<SystemTotals>("/audit/totals"),

  // Find user by email
  findUserByEmail: (email: string) =>
    api.get<User[]>(`/audit/users?email=${email}`),

  // Find account by account number
  findAccountByAccountNumber: (accountNumber: string) =>
    api.get<Account>(`/audit/accounts?accountNumber=${accountNumber}`),

  // Get transactions by account number
  getTransactionsByAccountNumber: (accountNumber: string) =>
    api.get<Transaction[]>(`/audit/transactions/by-account?accountNumber=${accountNumber}`),

  // Get transaction by ID
  getTransactionById: (id: string) =>
    api.get<Transaction>(`/audit/transactions/by-id?id=${id}`),
};

