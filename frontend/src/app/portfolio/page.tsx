"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import PortfolioForm, { type PortfolioFormValues } from "@/components/portfolio/portfolio-form";
import {
  createPortfolio,
  deletePortfolio,
  getPortfolios,
  type Portfolio,
  updatePortfolio,
} from "@/lib/api";

export default function PortfolioPage() {
  const queryClient = useQueryClient();
  const [editingPortfolio, setEditingPortfolio] = useState<Portfolio | null>(null);

  const portfoliosQuery = useQuery({
    queryKey: ["portfolios"],
    queryFn: getPortfolios,
  });

  const createMutation = useMutation({
    mutationFn: createPortfolio,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["portfolios"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: PortfolioFormValues }) =>
      updatePortfolio(id, payload),
    onSuccess: async () => {
      setEditingPortfolio(null);
      await queryClient.invalidateQueries({ queryKey: ["portfolios"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deletePortfolio,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["portfolios"] });
    },
  });

  const initialFormValues = useMemo<PortfolioFormValues | undefined>(() => {
    if (!editingPortfolio) return undefined;
    return {
      name: editingPortfolio.name,
      base_currency: editingPortfolio.base_currency,
    };
  }, [editingPortfolio]);

  async function handleSubmit(values: PortfolioFormValues) {
    if (editingPortfolio) {
      await updateMutation.mutateAsync({ id: editingPortfolio.id, payload: values });
      return;
    }

    await createMutation.mutateAsync(values);
  }

  return (
    <main className="min-h-screen bg-zinc-50 p-6">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <header className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-zinc-500">N800 Portfolio Manager</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">Portfolios</h1>
        </header>

        <PortfolioForm
          initialValues={initialFormValues}
          submitLabel={editingPortfolio ? "Update Portfolio" : "Create Portfolio"}
          onSubmit={handleSubmit}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
        />

        <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-zinc-900">All Portfolios</h2>

          <div className="mt-4 space-y-3">
            {portfoliosQuery.isLoading ? (
              <p className="text-sm text-zinc-500">Loading portfolios...</p>
            ) : portfoliosQuery.isError ? (
              <p className="text-sm text-red-600">Failed to load portfolios.</p>
            ) : portfoliosQuery.data?.length ? (
              portfoliosQuery.data.map((portfolio) => (
                <div
                  key={portfolio.id}
                  className="flex flex-col gap-3 rounded-xl border border-zinc-200 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="font-medium text-zinc-900">{portfolio.name}</p>
                    <p className="text-sm text-zinc-500">Base currency: {portfolio.base_currency}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingPortfolio(portfolio)}
                      className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteMutation.mutate(portfolio.id)}
                      disabled={deleteMutation.isPending}
                      className="rounded-lg border border-red-300 px-3 py-1.5 text-xs font-medium text-red-600 disabled:opacity-60"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-zinc-500">No portfolios yet.</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}