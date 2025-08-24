import axios, { AxiosError } from "axios";
import { useAuth } from "@/store/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 60000,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    // If request failed with 401 (unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Don't retry if this IS the refresh request that failed
      if (originalRequest.url?.includes('/refresh-access-token')) {
        console.warn("Refresh token request failed - user needs to login");
        useAuth.getState().logout();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Wait until refresh finishes
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call your refresh endpoint
        const refreshResponse = await api.get("/users/refresh-access-token", {
          withCredentials: true,
        });

        // Check if refresh was actually successful
        if (refreshResponse.status === 200) {
          processQueue(null);
          return api(originalRequest); // retry original request
        } else {
          throw new Error("Refresh failed");
        }
      } catch (refreshError) {
        processQueue(refreshError, null);

        // If refresh fails, logout user
        console.warn("Refresh token failed — redirecting to login");
        useAuth.getState().logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false; // Fix: was using colon instead of equals
      }
    }

    return Promise.reject(error);
  }
);

export default api;