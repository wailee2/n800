import httpx
import os

FRANKFURTER = os.getenv("FRANKFURTER_BASE_URL")
COINGECKO = os.getenv("COINGECKO_BASE_URL")
COINGECKO_KEY = os.getenv("COINGECKO_API_KEY")
STOOQ = os.getenv("STOOQ_BASE_URL")

async def get_fx_rate(from_cur: str, to_cur: str = "usd") -> float | None:
    url = f"{FRANKFURTER}/latest?from={from_cur}&to={to_cur}"
    async with httpx.AsyncClient() as client:
        resp = await client.get(url)
        if resp.status_code == 200:
            data = resp.json()
            return data["rates"].get(to_cur.upper())
        return None

async def get_crypto_price(symbol: str) -> float | None:
    url = f"{COINGECKO}/simple/price?ids={symbol}&vs_currencies=usd"
    headers = {"accept": "application/json"}
    if COINGECKO_KEY:
        headers["x-cg-demo-api-key"] = COINGECKO_KEY
    async with httpx.AsyncClient() as client:
        resp = await client.get(url, headers=headers)
        if resp.status_code == 200:
            data = resp.json()
            return data.get(symbol, {}).get("usd")
        return None

async def get_stock_price(symbol: str) -> float | None:
    # Stooq expects ticker like "aapl.us" or "xauusd"
    url = f"{STOOQ}/q/l/?s={symbol}&f=sd2t2ohlcv&h&e=csv"
    async with httpx.AsyncClient() as client:
        resp = await client.get(url)
        if resp.status_code == 200:
            lines = resp.text.strip().split("\n")
            if len(lines) > 1:
                values = lines[1].split(",")
                return float(values[3])  # close price
        return None

async def get_gold_price() -> float | None:
    return await get_stock_price("xauusd")