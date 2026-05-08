"use client";

import { Asset, deleteAsset } from "@/lib/api";

type Props = {
  token: string;
  assets: Asset[];
  onRefresh: () => void;
};

export function AssetsTable({ token, assets, onRefresh }: Props) {
  const handleDelete = async (id: number) => {
    const ok = confirm("Delete this asset?");
    if (!ok) return;

    await deleteAsset(token, id);
    onRefresh();
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <div className="border-b border-zinc-200 p-4">
        <h2 className="text-lg font-semibold">Your Assets</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-zinc-50 text-zinc-600">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Qty</th>
              <th className="px-4 py-3">Buy Price</th>
              <th className="px-4 py-3">Current Price</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset) => {
              const current = asset.current_price ?? 0;
              const invested = asset.quantity * asset.purchase_price;
              const currentValue = asset.quantity * current;
              const profit = currentValue - invested;

              return (
                <tr key={asset.id} className="border-t border-zinc-200">
                  <td className="px-4 py-3">
                    <div className="font-medium text-zinc-900">{asset.name}</div>
                    <div className="text-xs text-zinc-500">{asset.symbol}</div>
                  </td>
                  <td className="px-4 py-3">{asset.type}</td>
                  <td className="px-4 py-3">{asset.quantity}</td>
                  <td className="px-4 py-3">${asset.purchase_price.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    {asset.current_price === null ? "N/A" : `$${asset.current_price.toFixed(2)}`}
                    <div className={`text-xs ${profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {asset.current_price === null ? "" : `${profit >= 0 ? "+" : ""}$${profit.toFixed(2)}`}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(asset.id)}
                      className="rounded-lg bg-red-50 px-3 py-1.5 text-sm text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}

            {assets.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-zinc-500" colSpan={6}>
                  No assets yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}