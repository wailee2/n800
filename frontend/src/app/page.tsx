"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchJSON } from "@/lib/api";
import { PortfolioSummary } from "@/lib/types";
import SummaryCards from "@/components/SummaryCards";
import AllocationChart from "@/components/AllocationChart";
import AiAdvicePanel from "@/components/AiAdvicePanel";

export default function Dashboard() {
  const { data: summary, isLoading } = useQuery<PortfolioSummary>({
    queryKey: ["summary"],
    queryFn: () => fetchJSON("/portfolio/summary"),
  });

  if (isLoading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">N800 Portfolio Dashboard</h1>
      {summary && <SummaryCards summary={summary} />}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {summary && <AllocationChart data={summary.allocation_by_category} />}
        <AiAdvicePanel />
      </div>
    </div>
  );
}