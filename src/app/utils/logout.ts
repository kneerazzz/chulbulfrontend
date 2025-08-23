// utils/authActions.ts
import { api } from "@/lib/api";
import { useAuth } from "@/store/auth";

export async function logout() {
  try {
    // Call backend logout route (if you have refresh token invalidation)
    await api.post("/users/logout", {} , {
      withCredentials: true
    })
  } catch (err) {
    console.error("Backend logout failed", err);
  } finally {
    // Always clear Zustand regardless
    useAuth.getState().logout();
  }
}
