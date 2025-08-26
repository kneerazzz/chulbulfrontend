// lib/api.ts
import axios, { AxiosError } from "axios";
import { useAuth } from "@/store/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Keep for cookie-based auth (web)
  timeout: 60000,
});

// Token management functions
export const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  return localStorage.getItem('accessToken') || 
         localStorage.getItem('authToken') ||
         localStorage.getItem('token') ||
         sessionStorage.getItem('accessToken');
};

export const setAuthToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', token);
  }
  // Set the Authorization header for all future requests
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const clearAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('authToken');
    localStorage.removeItem('token');
    sessionStorage.removeItem('accessToken');
  }
  // Remove Authorization header
  delete api.defaults.headers.common['Authorization'];
};

// Initialize token on app start
const initializeAuth = () => {
  const token = getStoredToken();
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

// Call initialization
initializeAuth();

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

// Request interceptor to ensure token is always attached
api.interceptors.request.use(
  (config) => {
    // If no Authorization header is set, try to get token from storage
    if (!config.headers.Authorization) {
      const token = getStoredToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with dual auth support
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Don't retry refresh token requests
      if (originalRequest.url?.includes('/refresh-access-token')) {
        console.warn("Refresh token request failed");
        clearAuthToken();
        useAuth.getState().logout();
        return Promise.reject(error);
      }

      if (isRefreshing) {
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
        // Try to refresh the token
        const refreshResponse = await api.get("/users/refresh-access-token", {
          withCredentials: true
        });

        // Handle different refresh response patterns
        if (refreshResponse.status === 200) {
          // If server returns a new access token in response
          if (refreshResponse.data?.accessToken) {
            const newToken = refreshResponse.data.accessToken;
            setAuthToken(newToken);
            
            // Update the failed request with new token
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          
          processQueue(null);
          return api(originalRequest);
        } else {
          throw new Error("Refresh failed");
        }
      } catch (refreshError) {
        console.warn("Token refresh failed:", refreshError);
        processQueue(refreshError, null);
        clearAuthToken();
        useAuth.getState().logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false; // Fix: was using colon instead of equals
      }
    }

    return Promise.reject(error);
  }
);

// Helper function to check if user has any auth credentials
export const hasAuthCredentials = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Check for stored tokens (mobile/SPA)
  const hasToken = !!getStoredToken();
  
  // Check for cookies (web) - though HTTP-only cookies won't be visible
  const hasCookies = document.cookie.length > 0;
  
  // Check if Authorization header is set
  const hasAuthHeader = !!api.defaults.headers.common['Authorization'];
  
  return hasToken || hasCookies || hasAuthHeader;
};

export { api as default };