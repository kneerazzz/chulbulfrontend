// utils/authActions.ts
import { useAuth } from "@/store/auth";
import { api, hasAuthCredentials, clearAuthToken } from "@/lib/api";

export async function syncAuthState(): Promise<boolean> {
  try {
    const res = await api.get("/users/get-user-details", { 
      withCredentials: true,
      timeout: 3000 // 3 second timeout for auth check
    });

    if (res.data?.data) {
      // hydrate Zustand with server user details
      useAuth.getState().login(res.data.data);
      return true;
    } else {
      // no user found → clear auth state
      useAuth.getState().logout();
      clearAuthToken();
      return false;
    }
  } catch (err: any) {
    console.error("Auth sync error:", err);
    
    // Clear tokens on auth failure
    clearAuthToken();
    useAuth.getState().logout();
    return false;
  }
}

// Quick auth check with very short timeout
export async function quickAuthCheck(): Promise<boolean> {
  try {
    const res = await api.get("/users/get-user-details", { 
      withCredentials: true,
      timeout: 2000 // Very short timeout for quick check
    });

    if (res.data?.data) {
      useAuth.getState().login(res.data.data);
      return true;
    }
    return false;
  } catch (error) {
    clearAuthToken();
    useAuth.getState().logout();
    return false;
  }
}

// Export the credential check function
export { hasAuthCredentials };