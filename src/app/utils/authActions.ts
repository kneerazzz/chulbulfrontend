// src/utils/authActions.ts
import { useAuth } from "@/store/auth";
import { api } from "@/lib/api";

export async function syncAuthState() {
  try {
    const res = await api.get("/users/get-user-details", { withCredentials: true });

    if (res.data?.data) {
      // hydrate Zustand with server user details
      useAuth.getState().login(res.data.data);
    } else {
      // no user found → clear auth state
      useAuth.getState().logout();
    }
  } catch (err: any) {
    console.error(err)
    useAuth.getState().logout();
  }
}
