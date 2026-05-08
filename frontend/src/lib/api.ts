const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export type AuthResponse = {
  token: string;
  user_id: number;
};

export type Asset = {
  id: number;
  type: string;
  name: string;
  symbol: string;
  quantity: number;
  purchase_price: number;
  purchase_date: string | null;
  notes: string;
  current_price: number | null;
};

export type AdviceResponse = {
  portfolio_summary: {
    total_value: number;
    total_invested: number;
    roi_percent: number;
    assets: string[];
  };
  advices: string[];
};

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error || data?.message || "Request failed");
  }

  return data as T;
}

export async function registerUser(username: string, password: string) {
  return request<AuthResponse>("/register", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export async function loginUser(username: string, password: string) {
  return request<AuthResponse>("/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export async function getAssets(token: string) {
  return request<Asset[]>("/assets", { method: "GET" }, token);
}

export async function createAsset(
  token: string,
  payload: {
    type: string;
    name: string;
    symbol?: string;
    quantity: number;
    purchase_price: number;
    purchase_date?: string;
    notes?: string;
  }
) {
  return request<{ message: string; id: number }>("/assets", {
    method: "POST",
    body: JSON.stringify(payload),
  }, token);
}

export async function updateAsset(
  token: string,
  id: number,
  payload: Partial<{
    type: string;
    name: string;
    symbol: string;
    quantity: number;
    purchase_price: number;
    purchase_date: string;
    notes: string;
  }>
) {
  return request<{ message: string }>(`/assets/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  }, token);
}

export async function deleteAsset(token: string, id: number) {
  return request<{ message: string }>(`/assets/${id}`, {
    method: "DELETE",
  }, token);
}

export async function getAdvice(token: string) {
  return request<AdviceResponse>("/advice", { method: "GET" }, token);
}