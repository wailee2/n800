"use client";

import { useState } from "react";
import { loginUser, registerUser } from "@/lib/api";

type Props = {
  onSuccess: (token: string, userId: number) => void;
};

export function AuthForm({ onSuccess }: Props) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result =
        mode === "login"
          ? await loginUser(username, password)
          : await registerUser(username, password);

      localStorage.setItem("token", result.token);
      localStorage.setItem("user_id", String(result.user_id));
      onSuccess(result.token, result.user_id);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex gap-2">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`flex-1 rounded-xl px-4 py-2 text-sm font-medium ${
            mode === "login" ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-700"
          }`}
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => setMode("register")}
          className={`flex-1 rounded-xl px-4 py-2 text-sm font-medium ${
            mode === "register" ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-700"
          }`}
        >
          Register
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-xl border border-zinc-300 px-4 py-2 outline-none focus:border-zinc-900"
            placeholder="Enter username"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">Password</label>
          <input
            value={password}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-zinc-300 px-4 py-2 outline-none focus:border-zinc-900"
            placeholder="Enter password"
          />
        </div>

        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          disabled={loading}
          className="w-full rounded-xl bg-zinc-900 px-4 py-2.5 font-medium text-white disabled:opacity-60"
        >
          {loading ? "Please wait..." : mode === "login" ? "Login" : "Create account"}
        </button>
      </form>
    </div>
  );
}