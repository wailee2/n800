"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchJSON } from "@/lib/api";

export default function AiAdvicePanel() {
  const { data } = useQuery<{ advice: string[] }>({
    queryKey: ["advice"],
    queryFn: () => fetchJSON("/ai/advice"),
  });

  const adviceList = data?.advice || [];

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-4">AI Portfolio Advice</h2>
      <div className="space-y-3">
        {adviceList.map((text, i) => (
          <div key={i} className="p-3 bg-blue-50 dark:bg-blue-900 rounded-lg text-sm">
            {text}
          </div>
        ))}
      </div>
    </div>
  );
}