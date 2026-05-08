"use client";

import { useQuery } from "@tanstack/react-query";
import AdviceCards from "@/components/dashboard/advice-cards";
import PortfolioChart from "@/components/dashboard/portfolio-chart";
import SummaryCards from "@/components/dashboard/summary-cards";
import { getDashboard } from "@/lib/api";

export default function DashboardPage() {
  const portfolioId = 1;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard", portfolioId],
    queryFn: () => getDashboard(portfolioId),
  });

  if (isLoading) {
    return (
      <main className="min-h-screen bg-zinc-50 p-6">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm text-zinc-500">Loading dashboard...</p>
        </div>
      </main>
    );
  }

  if (isError || !data) {
    return (
      <main className="min-h-screen bg-zinc-50 p-6">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm text-red-600">Failed to load dashboard data.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50 p-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <header className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-zinc-500">N800 Portfolio Manager</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
            {data.portfolio_name}
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            Base currency: {data.base_currency}
          </p>
        </header>

        <SummaryCards
          totalCurrentValue={data.total_current_value}
          totalInitialValue={data.total_initial_value}
          roiPercent={data.roi_percent}
          yearlyReturn={data.yearly_return}
          profitLoss={data.profit_loss}
          baseCurrency={data.base_currency}
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <PortfolioChart
            data={data.category_breakdown.map((item) => ({
              category: item.category,
              value: item.value,
            }))}
          />

          <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-zinc-900">Allocation Details</h2>
            <div className="mt-5 space-y-4">
              {data.category_breakdown.map((item) => (
                <div key={item.category}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-zinc-700">{item.category}</span>
                    <span className="text-zinc-500">{item.percent.toFixed(2)}%</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-zinc-100">
                    <div
                      className="h-2 rounded-full bg-zinc-900"
                      style={{ width: `${Math.min(item.percent, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <AdviceCards advice={data.advice} />
      </div>
    </main>
  );
}