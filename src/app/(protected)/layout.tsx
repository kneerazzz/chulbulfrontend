"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "../components/loader";
import { useAuth } from "@/store/auth";
import { syncAuthState } from "../utils/authActions";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      await syncAuthState(); // ✅ hydrate Zustand from server
      setLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login"); 
    }
  }, [loading, isAuthenticated, router]);

  if (loading) return <Loader />;

  return <>{children}</>;
}
