import api from "./api";
import type {
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  AuthResponse,
} from "../types/api.types";

export const authApi = {
  login: (body: LoginRequest) =>
    api.post<AuthResponse>("/auth/login", body),

  register: (body: RegisterRequest) =>
    api.post<AuthResponse>("/auth/register", body),

  logout: () =>
    api.post<void>("/auth/logout"),

  forgetPassword: (body: ForgotPasswordRequest) =>
    api.post<void>("/auth/forgot-password", body),

  resetPassword: (body: ResetPasswordRequest) =>
    api.post<void>("/auth/reset-password", body),

  refreshToken: () =>
    api.post<AuthResponse>("/auth/refresh"),
};

