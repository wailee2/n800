"use client";

import { useEffect, useState } from "react";

export type HoldingFormValues = {
  portfolio_id: number;
  name: string;
  category: string;
  quantity: number;
  purchase_price: number;
  current_price: number;
  notes?: string | null;
};

type HoldingFormProps = {
  initialValues?: HoldingFormValues;
  submitLabel?: string;
  portfolioOptions: { id: number; name: string }[];
  onSubmit: (values: HoldingFormValues) => Promise<void> | void;
  isSubmitting?: boolean;
};

const DEFAULT_VALUES: HoldingFormValues = {
  portfolio_id: 1,
  name: "",
  category: "FIAT",
  quantity: 0,
  purchase_price: 0,
  current_price: 0,
  notes: "",
};

export default function HoldingForm({
  initialValues,
  submitLabel = "Save Holding",
  portfolioOptions,
  onSubmit,
  isSubmitting = false,
}: HoldingFormProps) {
  const [values, setValues] = useState<HoldingFormValues>(initialValues ?? DEFAULT_VALUES);

  useEffect(() => {
    if (initialValues) {
      setValues(initialValues);
      return;
    }

    const firstPortfolio = portfolioOptions[0];
    setValues((prev) => ({
      ...DEFAULT_VALUES,
      portfolio_id: firstPortfolio?.id ?? prev.portfolio_id,
    }));
  }, [initialValues, portfolioOptions]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await onSubmit({
      portfolio_id: Number(values.portfolio_id),
      name: values.name.trim(),
      category: values.category.trim().toUpperCase(),
      quantity: Number(values.quantity),
      purchase_price: Number(values.purchase_price),
      current_price: Number(values.current_price),
      notes: values.notes?.trim() || null,
    });

    if (!initialValues) {
      setValues((prev) => ({
        ...DEFAULT_VALUES,
        portfolio_id: portfolioOptions[0]?.id ?? prev.portfolio_id,
      }));
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-zinc-900">Holding</h2>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm">
          <span className="font-medium text-zinc-700">Portfolio</span>
          <select
            value={values.portfolio_id}
            onChange={(e) => setValues((prev) => ({ ...prev, portfolio_id: Number(e.target.value) }))}
            className="rounded-xl border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-900"
            required
          >
            {portfolioOptions.map((portfolio) => (
              <option key={portfolio.id} value={portfolio.id}>
                {portfolio.name}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm">
          <span className="font-medium text-zinc-700">Name</span>
          <input
            type="text"
            value={values.name}
            onChange={(e) => setValues((prev) => ({ ...prev, name: e.target.value }))}
            className="rounded-xl border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-900"
            placeholder="Gold Bar"
            required
          />
        </label>

        <label className="grid gap-2 text-sm">
          <span className="font-medium text-zinc-700">Category</span>
          <select
            value={values.category}
            onChange={(e) => setValues((prev) => ({ ...prev, category: e.target.value }))}
            className="rounded-xl border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-900"
            required
          >
            <option value="FIAT">FIAT</option>
            <option value="ASSET">ASSET</option>
            <option value="GOLD">GOLD</option>
          </select>
        </label>

        <label className="grid gap-2 text-sm">
          <span className="font-medium text-zinc-700">Quantity</span>
          <input
            type="number"
            step="any"
            value={values.quantity}
            onChange={(e) => setValues((prev) => ({ ...prev, quantity: Number(e.target.value) }))}
            className="rounded-xl border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-900"
            required
          />
        </label>

        <label className="grid gap-2 text-sm">
          <span className="font-medium text-zinc-700">Purchase Price</span>
          <input
            type="number"
            step="any"
            value={values.purchase_price}
            onChange={(e) => setValues((prev) => ({ ...prev, purchase_price: Number(e.target.value) }))}
            className="rounded-xl border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-900"
            required
          />
        </label>

        <label className="grid gap-2 text-sm">
          <span className="font-medium text-zinc-700">Current Price</span>
          <input
            type="number"
            step="any"
            value={values.current_price}
            onChange={(e) => setValues((prev) => ({ ...prev, current_price: Number(e.target.value) }))}
            className="rounded-xl border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-900"
            required
          />
        </label>
      </div>

      <label className="mt-4 grid gap-2 text-sm">
        <span className="font-medium text-zinc-700">Notes</span>
        <textarea
          value={values.notes ?? ""}
          onChange={(e) => setValues((prev) => ({ ...prev, notes: e.target.value }))}
          className="min-h-28 rounded-xl border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-900"
          placeholder="Optional notes"
        />
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-5 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {isSubmitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}