export interface Holding {
  id: number;
  name: string;
  category: "fiat" | "asset" | "gold";
  symbol: string;
  quantity: number;
  buy_price: number;
  current_price: number;
  buy_date: string;
  notes?: string;
}

export interface PortfolioSummary {
  total_invested: number;
  current_value: number;
  profit_loss: number;
  roi_percent: number;
  annual_return: number;
  annualized_return: number;
  allocation_by_category: Record<string, number>;
  best_performing: { name: string; symbol: string; roi: number } | null;
  worst_performing: { name: string; symbol: string; roi: number } | null;
}