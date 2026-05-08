"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import HoldingForm, { type HoldingFormValues } from "@/components/holdings/holding-form";
import HoldingsTable from "@/components/holdings/holdings-table";
import {
  createHolding,
  deleteHolding,
  getHoldings,
  getPortfolios,
  type Holding,
  type Portfolio,
  updateHolding,
} from "@/lib/api";

export default function HoldingsPage() {
  const queryClient = useQueryClient();
  const portfoliosQuery = useQuery({
    queryKey: ["portfolios"],
    queryFn: getPortfolios,
  });

  const [selectedPortfolioId, setSelectedPortfolioId] = useState<number | null>(null);
  const [editingHolding, setEditingHolding] = useState<Holding | null>(null);

  useEffect(() => {
    if (selectedPortfolioId === null && portfoliosQuery.data?.length) {
      setSelectedPortfolioId(portfoliosQuery.data[0].id);
    }
  }, [portfoliosQuery.data, selectedPortfolioId]);

  const holdingsQuery = useQuery({
    queryKey: ["holdings", selectedPortfolioId],
    queryFn: () => getHoldings(selectedPortfolioId ?? undefined),
    enabled: selectedPortfolioId !== null,
  });

  const createMutation = useMutation({
    mutationFn: createHolding,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["holdings", selectedPortfolioId] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: HoldingFormValues }) =>
      updateHolding(id, payload),
    onSuccess: async () => {
      setEditingHolding(null);
      await queryClient.invalidateQueries({ queryKey: ["holdings", selectedPortfolioId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteHolding,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["holdings", selectedPortfolioId] });
    },
  });

  const portfolioOptions = portfoliosQuery.data ?? [];

  const initialFormValues = useMemo<HoldingFormValues | undefined>(() => {
    if (!editingHolding) return undefined;
    return {
      portfolio_id: editingHolding.portfolio_id,
      name: editingHolding.name,
      category: editingHolding.category,
      quantity: editingHolding.quantity,
      purchase_price: editingHolding.purchase_price,
      current_price: editingHolding.current_price,
      notes: editingHolding.notes ?? "",
    };
  }, [editingHolding]);

  async function handleSubmit(values: HoldingFormValues) {
    if (editingHolding) {
      await updateMutation.mutateAsync({ id: editingHolding.id, payload: values });
      return;
    }

    await createMutation.mutateAsync(values);
  }

  async function handleDelete(holding: Holding) {
    await deleteMutation.mutateAsync(holding.id);
  }

  function handleEdit(holding: Holding) {
    setEditingHolding(holding);
    setSelectedPortfolioId(holding.portfolio_id);
  }

  return (
    <main className="min-h-screen bg-zinc-50 p-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <header className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-zinc-500">N800 Portfolio Manager</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">Holdings</h1>
        </header>

        <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-zinc-900">Select Portfolio</h2>
              <p className="text-sm text-zinc-500">Choose which portfolio to manage.</p>
            </div>

            <select
              value={selectedPortfolioId ?? ""}
              onChange={(e) => setSelectedPortfolioId(Number(e.target.value))}
              className="rounded-xl border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-900"
            >
              {portfolioOptions.map((portfolio: Portfolio) => (
                <option key={portfolio.id} value={portfolio.id}>
                  {portfolio.name}
                </option>
              ))}
            </select>
          </div>
        </section>

        <HoldingForm
          initialValues={initialFormValues}
          submitLabel={editingHolding ? "Update Holding" : "Create Holding"}
          portfolioOptions={portfolioOptions}
          onSubmit={handleSubmit}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
        />

        <HoldingsTable
          holdings={holdingsQuery.data ?? []}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isDeletingId={deleteMutation.isPending ? deleteMutation.variables ?? null : null}
        />

        {holdingsQuery.isError ? (
          <p className="text-sm text-red-600">Failed to load holdings.</p>
        ) : null}
      </div>
    </main>
  );
}