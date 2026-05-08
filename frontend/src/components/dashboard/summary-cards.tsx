type SummaryCardsProps = {
  totalCurrentValue: number;
  totalInitialValue: number;
  roiPercent: number;
  yearlyReturn: number;
  profitLoss: number;
  baseCurrency: string;
};

function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

export default function SummaryCards({
  totalCurrentValue,
  totalInitialValue,
  roiPercent,
  yearlyReturn,
  profitLoss,
  baseCurrency,
}: SummaryCardsProps) {
  const cards = [
    {
      label: "Total Value",
      value: formatMoney(totalCurrentValue, baseCurrency),
    },
    {
      label: "Initial Value",
      value: formatMoney(totalInitialValue, baseCurrency),
    },
    {
      label: "ROI",
      value: `${roiPercent.toFixed(2)}%`,
    },
    {
      label: "Yearly Return",
      value: formatMoney(yearlyReturn, baseCurrency),
    },
    {
      label: "Profit / Loss",
      value: formatMoney(profitLoss, baseCurrency),
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => (
        <div key={card.label} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-zinc-500">{card.label}</p>
          <p className="mt-2 text-xl font-semibold text-zinc-900">{card.value}</p>
        </div>
      ))}
    </section>
  );
}