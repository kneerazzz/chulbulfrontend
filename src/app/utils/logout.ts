import { api } from "@/lib/api";
import { useAuth } from "@/store/auth";

export async function logout() {
  try {
    await api.post("/users/logout", {}, { withCredentials: true });
  } catch (err: any) {
    console.error(err)
    console.warn("Logout API failed, clearing state anyway");
  } finally {
    useAuth.getState().logout();
  }
}
