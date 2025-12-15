import api from "./api";
import type {
  User,
  UserCreateRequest,
  UserUpdateRequest,
  UpdatePasswordRequest,
  ApiResponse,
} from "../types/api.types";

export const userApi = {
  getAll: () =>
    api.get<User[]>("/users"),

  getById: (id: string) =>
    api.get<User>(`/users/${id}`),

  getMyProfile: () =>
    api.get<ApiResponse<User>>("/users/me"),

  create: (userData: UserCreateRequest) =>
    api.post<User>("/users", userData),

  update: (id: string, userData: UserUpdateRequest) =>
    api.put<ApiResponse<User>>(`/users/${id}`, userData),

  delete: (id: string) =>
    api.delete<void>(`/users/${id}`),

  updatePassword: (body: UpdatePasswordRequest) =>
    api.put<void>("/users/update-password", body),

  uploadProfilePicture: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    return api.put<ApiResponse<User>>("/users/profile-picture", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

