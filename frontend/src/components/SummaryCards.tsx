import { PortfolioSummary } from "@/lib/types";

export default function SummaryCards({ summary }: { summary: PortfolioSummary }) {
  const cards = [
    { label: "Total Value", value: `$${summary.current_value.toLocaleString()}` },
    { label: "Invested", value: `$${summary.total_invested.toLocaleString()}` },
    { label: "Profit / Loss", value: `$${summary.profit_loss.toLocaleString()}`, color: summary.profit_loss >= 0 ? "text-green-600" : "text-red-600" },
    { label: "ROI", value: `${summary.roi_percent}%`, color: summary.roi_percent >= 0 ? "text-green-600" : "text-red-600" },
    { label: "Yearly Gain", value: `$${summary.annual_return.toLocaleString()}` },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {cards.map((c) => (
        <div key={c.label} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
          <p className="text-sm text-gray-500">{c.label}</p>
          <p className={`text-2xl font-semibold ${c.color || ""}`}>{c.value}</p>
        </div>
      ))}
    </div>
  );
}