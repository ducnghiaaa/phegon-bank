// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface UpdatePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface AuthResponse {
  data: {
    token: string;
    roles: string[];
  };
  message: string;
  statusCode: number;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  statusCode: number;
}

// User Types
export interface UserRole {
  id: number;
  name: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  active: boolean;
  roles: UserRole[];
  accounts?: Account[];
  createdAt?: string;
  updatedAt?: string;
  profilePicture?: string;
}

export interface UserCreateRequest {
  email: string;
  name: string;
  phone?: string;
  password?: string;
}

export interface UserUpdateRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
}

// Account Types
export interface Account {
  id: string;
  accountNumber: string;
  accountType: string;
  balance: number;
  currency: string;
  status: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  transactions?: Transaction[];
}

// Transaction Types
export interface Transaction {
  id: string | number;
  accountNumber?: string; // For backward compatibility
  sourceAccount?: string; // New API format
  destinationAccount?: string; // New API format
  transactionType: "DEPOSIT" | "WITHDRAWAL" | "TRANSFER";
  amount: number;
  description?: string;
  recipientAccountNumber?: string; // For backward compatibility
  status: "PENDING" | "COMPLETED" | "FAILED" | "SUCCESS";
  createdAt?: string; // For backward compatibility
  transactionDate?: string; // New API format
  updatedAt?: string;
}

export interface TransferRequest {
  fromAccountNumber: string;
  toAccountNumber: string;
  amount: number;
  description?: string;
}

export interface DepositRequest {
  accountNumber: string;
  amount: number;
  description?: string;
  depositMethod?: string;
}

export interface WithdrawalRequest {
  accountNumber: string;
  amount: number;
  description?: string;
  recipientAccountNumber?: string;
  otp?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

// Audit Types
export interface SystemTotals {
  totalUsers: number;
  totalAccounts: number;
  totalTransactions: number;
  totalBalance: number;
}

