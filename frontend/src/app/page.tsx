"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AuthForm } from "@/components/auth/auth-form";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) router.push("/dashboard");
  }, [router]);

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-12">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-center">
        <section>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
            Portfolio Manager
          </h1>
          <p className="mt-4 max-w-xl text-lg text-zinc-600">
            Track your assets, see current value, and get AI-powered advice from your Flask backend.
          </p>
        </section>

        <AuthForm
          onSuccess={() => {
            router.push("/dashboard");
          }}
        />
      </div>
    </main>
  );
}