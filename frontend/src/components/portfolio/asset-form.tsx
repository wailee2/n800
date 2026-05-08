"use client";

import { useState } from "react";
import { createAsset } from "@/lib/api";

type Props = {
  token: string;
  onCreated: () => void;
};

export function AssetForm({ token, onCreated }: Props) {
  const [form, setForm] = useState({
    type: "STOCK",
    name: "",
    symbol: "",
    quantity: "",
    purchase_price: "",
    purchase_date: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateField = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await createAsset(token, {
        type: form.type,
        name: form.name,
        symbol: form.symbol || form.name,
        quantity: Number(form.quantity),
        purchase_price: Number(form.purchase_price),
        purchase_date: form.purchase_date || undefined,
        notes: form.notes,
      });

      setForm({
        type: "STOCK",
        name: "",
        symbol: "",
        quantity: "",
        purchase_price: "",
        purchase_date: "",
        notes: "",
      });

      onCreated();
    } catch (err: any) {
      setError(err.message || "Failed to add asset");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-zinc-900">Add Asset</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Type</label>
          <select
            value={form.type}
            onChange={(e) => updateField("type", e.target.value)}
            className="w-full rounded-xl border border-zinc-300 px-4 py-2 outline-none"
          >
            <option value="FIAT">FIAT</option>
            <option value="GOLD">GOLD</option>
            <option value="CRYPTO">CRYPTO</option>
            <option value="STOCK">STOCK</option>
            <option value="ETF">ETF</option>
            <option value="OTHER">OTHER</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Name</label>
          <input
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            className="w-full rounded-xl border border-zinc-300 px-4 py-2 outline-none"
            placeholder="e.g. Bitcoin"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Symbol</label>
          <input
            value={form.symbol}
            onChange={(e) => updateField("symbol", e.target.value)}
            className="w-full rounded-xl border border-zinc-300 px-4 py-2 outline-none"
            placeholder="e.g. BTC"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Quantity</label>
          <input
            value={form.quantity}
            onChange={(e) => updateField("quantity", e.target.value)}
            type="number"
            step="any"
            className="w-full rounded-xl border border-zinc-300 px-4 py-2 outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Purchase Price</label>
          <input
            value={form.purchase_price}
            onChange={(e) => updateField("purchase_price", e.target.value)}
            type="number"
            step="any"
            className="w-full rounded-xl border border-zinc-300 px-4 py-2 outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Purchase Date</label>
          <input
            value={form.purchase_date}
            onChange={(e) => updateField("purchase_date", e.target.value)}
            type="datetime-local"
            className="w-full rounded-xl border border-zinc-300 px-4 py-2 outline-none"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium">Notes</label>
          <textarea
            value={form.notes}
            onChange={(e) => updateField("notes", e.target.value)}
            className="min-h-24 w-full rounded-xl border border-zinc-300 px-4 py-2 outline-none"
            placeholder="Optional notes"
          />
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <button
        disabled={loading}
        className="mt-5 rounded-xl bg-zinc-900 px-5 py-2.5 font-medium text-white disabled:opacity-60"
      >
        {loading ? "Saving..." : "Add Asset"}
      </button>
    </form>
  );
}