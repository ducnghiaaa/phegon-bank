export interface WalletAccount {
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

export type TransactionType = "transfer" | "withdraw";

