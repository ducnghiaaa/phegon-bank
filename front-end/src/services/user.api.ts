import api from "./api";
import type { User, UserCreateRequest, UserUpdateRequest } from "../types/api.types";

export const userApi = {
  getAll: () =>
    api.get<User[]>("/users"),

  getById: (id: string) =>
    api.get<User>(`/users/${id}`),

  create: (userData: UserCreateRequest) =>
    api.post<User>("/users", userData),

  update: (id: string, userData: UserUpdateRequest) =>
    api.put<User>(`/users/${id}`, userData),

  delete: (id: string) =>
    api.delete<void>(`/users/${id}`),
};

