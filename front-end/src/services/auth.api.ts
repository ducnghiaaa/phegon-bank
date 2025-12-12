import api from "./api";
import type { LoginRequest, RegisterRequest, AuthResponse, User } from "../types/api.types";

export const authApi = {
  login: (email: string, password: string) =>
    api.post<AuthResponse>("/auth/login", { email, password } satisfies LoginRequest),

  register: (userData: RegisterRequest) =>
    api.post<AuthResponse>("/auth/register", userData),

  logout: () =>
    api.post<void>("/auth/logout"),

  getProfile: () =>
    api.get<User>("/auth/profile"),

  refreshToken: () =>
    api.post<AuthResponse>("/auth/refresh"),
};

