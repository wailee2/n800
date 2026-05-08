"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Dashboard } from "@/components/dashboard/dashboard";

export default function DashboardPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("token");
    if (!saved) {
      router.push("/");
      return;
    }
    setToken(saved);
  }, [router]);

  if (!token) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <Dashboard
      token={token}
      onLogout={() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        router.push("/");
      }}
    />
  );
}