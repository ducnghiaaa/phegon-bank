import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { apiService } from "./apiService";

// Loading state management
let loadingCount = 0;
let setLoadingGlobal: ((loading: boolean) => void) | null = null;

export const setLoadingHandler = (handler: (loading: boolean) => void) => {
  setLoadingGlobal = handler;
};

const updateLoading = (increment: boolean) => {
  if (setLoadingGlobal) {
    if (increment) {
      loadingCount++;
      if (loadingCount === 1) {
        setLoadingGlobal(true);
      }
    } else {
      loadingCount--;
      if (loadingCount <= 0) {
        loadingCount = 0;
        setLoadingGlobal(false);
      }
    }
  }
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8090/api",
  timeout: 10000,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Show loading khi bắt đầu request
    updateLoading(true);
    return config;
  },
  (error) => {
    // Hide loading nếu request bị lỗi ngay từ đầu
    updateLoading(false);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Hide loading khi response thành công
    updateLoading(false);
    return response;
  },
  (error: AxiosError) => {
    // Hide loading khi response lỗi
    updateLoading(false);
    if (error.response?.status === 401) {
      apiService.logout();
      if (globalThis.window !== undefined) {
        globalThis.window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;

