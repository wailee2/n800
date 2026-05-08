const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

export type CategoryBreakdownItem = {
  category: string;
  value: number;
  percent: number;
};

export type AdviceItem = {
  title: string;
  message: string;
  priority: "high" | "medium" | "low" | string;
};

export type DashboardSummary = {
  portfolio_id: number;
  portfolio_name: string;
  base_currency: string;
  total_initial_value: number;
  total_current_value: number;
  profit_loss: number;
  roi_percent: number;
  yearly_return: number;
  category_breakdown: CategoryBreakdownItem[];
  advice: AdviceItem[];
};

export async function getDashboard(portfolioId: number): Promise<DashboardSummary> {
  const res = await fetch(`${API_BASE_URL}/api/dashboard?portfolio_id=${portfolioId}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch dashboard data");
  }

  return res.json();
}

export type Portfolio = {
  id: number;
  name: string;
  base_currency: string;
  created_at: string;
  updated_at: string;
};

export type PortfolioCreate = {
  name: string;
  base_currency: string;
};

export type PortfolioUpdate = {
  name?: string;
  base_currency?: string;
};

export type Holding = {
  id: number;
  portfolio_id: number;
  name: string;
  category: string;
  quantity: number;
  purchase_price: number;
  current_price: number;
  notes: string | null;
  initial_value: number;
  current_value: number;
  created_at: string;
  updated_at: string;
};

export type HoldingCreate = {
  portfolio_id: number;
  name: string;
  category: string;
  quantity: number;
  purchase_price: number;
  current_price: number;
  notes?: string | null;
};

export type HoldingUpdate = Partial<HoldingCreate>;

export async function getPortfolios(): Promise<Portfolio[]> {
  const res = await fetch(`${API_BASE_URL}/api/portfolios`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch portfolios");
  return res.json();
}

export async function createPortfolio(payload: PortfolioCreate): Promise<Portfolio> {
  const res = await fetch(`${API_BASE_URL}/api/portfolios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create portfolio");
  return res.json();
}

export async function updatePortfolio(id: number, payload: PortfolioUpdate): Promise<Portfolio> {
  const res = await fetch(`${API_BASE_URL}/api/portfolios/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update portfolio");
  return res.json();
}

export async function deletePortfolio(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/portfolios/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete portfolio");
}

export async function getHoldings(portfolioId?: number): Promise<Holding[]> {
  const url = new URL(`${API_BASE_URL}/api/holdings`);
  if (portfolioId) url.searchParams.set("portfolio_id", String(portfolioId));
  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch holdings");
  return res.json();
}

export async function createHolding(payload: HoldingCreate): Promise<Holding> {
  const res = await fetch(`${API_BASE_URL}/api/holdings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create holding");
  return res.json();
}

export async function updateHolding(id: number, payload: HoldingUpdate): Promise<Holding> {
  const res = await fetch(`${API_BASE_URL}/api/holdings/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update holding");
  return res.json();
}

export async function deleteHolding(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/holdings/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete holding");
}