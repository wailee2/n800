"use client";

import { useEffect, useState } from "react";
import { Asset, AdviceResponse, getAdvice, getAssets } from "@/lib/api";
import { AssetForm } from "@/components/portfolio/asset-form";
import { AssetsTable } from "@/components/portfolio/assets-table";

type Props = {
  token: string;
  onLogout: () => void;
};

export function Dashboard({ token, onLogout }: Props) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [advice, setAdvice] = useState<AdviceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [assetData, adviceData] = await Promise.all([
        getAssets(token),
        getAdvice(token),
      ]);
      setAssets(assetData);
      setAdvice(adviceData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  const refreshAssets = async () => {
    setRefreshing(true);
    try {
      const [assetData, adviceData] = await Promise.all([
        getAssets(token),
        getAdvice(token),
      ]);
      setAssets(assetData);
      setAdvice(adviceData);
    } finally {
      setRefreshing(false);
    }
  };

  const totalInvested = assets.reduce((sum, a) => sum + a.quantity * a.purchase_price, 0);
  const totalValue = assets.reduce((sum, a) => sum + a.quantity * (a.current_price ?? 0), 0);
  const roi = totalInvested > 0 ? ((totalValue - totalInvested) / totalInvested) * 100 : 0;

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-xl font-bold text-zinc-900">Portfolio Manager</h1>
            <p className="text-sm text-zinc-500">Track assets, value, and AI advice</p>
          </div>

          <button
            onClick={onLogout}
            className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-zinc-500">Total Invested</p>
            <p className="mt-2 text-2xl font-bold">${totalInvested.toFixed(2)}</p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-zinc-500">Current Value</p>
            <p className="mt-2 text-2xl font-bold">${totalValue.toFixed(2)}</p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-zinc-500">ROI</p>
            <p className="mt-2 text-2xl font-bold">
              {roi >= 0 ? "+" : ""}
              {roi.toFixed(2)}%
            </p>
          </div>
        </div>

        <AssetForm token={token} onCreated={refreshAssets} />

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div>
            {loading ? (
              <div className="rounded-2xl border border-zinc-200 bg-white p-6">Loading assets...</div>
            ) : (
              <AssetsTable token={token} assets={assets} onRefresh={refreshAssets} />
            )}
          </div>

          <aside className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">AI Advice</h2>

            {refreshing && <p className="mt-2 text-sm text-zinc-500">Refreshing...</p>}

            <div className="mt-4 space-y-3">
              {advice?.advices?.map((item, index) => (
                <div key={index} className="rounded-xl bg-zinc-50 p-4 text-sm text-zinc-800">
                  {item}
                </div>
              ))}

              {!advice && !loading && (
                <p className="text-sm text-zinc-500">No advice yet.</p>
              )}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}