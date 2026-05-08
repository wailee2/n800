"use client";

import { useMemo } from "react";
import type { Holding } from "@/lib/api";

type HoldingsTableProps = {
  holdings: Holding[];
  onEdit: (holding: Holding) => void;
  onDelete: (holding: Holding) => Promise<void> | void;
  isDeletingId?: number | null;
};

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

export default function HoldingsTable({
  holdings,
  onEdit,
  onDelete,
  isDeletingId = null,
}: HoldingsTableProps) {
  const rows = useMemo(() => holdings ?? [], [holdings]);

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-zinc-900">Holdings</h2>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200 text-zinc-500">
              <th className="py-3 pr-4 font-medium">Name</th>
              <th className="py-3 pr-4 font-medium">Category</th>
              <th className="py-3 pr-4 font-medium">Quantity</th>
              <th className="py-3 pr-4 font-medium">Purchase Price</th>
              <th className="py-3 pr-4 font-medium">Current Price</th>
              <th className="py-3 pr-4 font-medium">Initial Value</th>
              <th className="py-3 pr-4 font-medium">Current Value</th>
              <th className="py-3 pr-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td className="py-6 text-zinc-500" colSpan={8}>
                  No holdings found.
                </td>
              </tr>
            ) : (
              rows.map((holding) => (
                <tr key={holding.id} className="border-b border-zinc-100 last:border-b-0">
                  <td className="py-3 pr-4 font-medium text-zinc-900">{holding.name}</td>
                  <td className="py-3 pr-4 text-zinc-600">{holding.category}</td>
                  <td className="py-3 pr-4 text-zinc-600">{holding.quantity}</td>
                  <td className="py-3 pr-4 text-zinc-600">{formatMoney(holding.purchase_price)}</td>
                  <td className="py-3 pr-4 text-zinc-600">{formatMoney(holding.current_price)}</td>
                  <td className="py-3 pr-4 text-zinc-600">{formatMoney(holding.initial_value)}</td>
                  <td className="py-3 pr-4 text-zinc-600">{formatMoney(holding.current_value)}</td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(holding)}
                        className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(holding)}
                        disabled={isDeletingId === holding.id}
                        className="rounded-lg border border-red-300 px-3 py-1.5 text-xs font-medium text-red-600 disabled:opacity-60"
                      >
                        {isDeletingId === holding.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}