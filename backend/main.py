from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session
from database import init_db, get_session
from crud import get_holdings, add_holding, update_holding, delete_holding
from schemas import HoldingCreate, HoldingUpdate
from calculations import calculate_portfolio
from ai import generate_advice
from market import get_fx_rate, get_crypto_price, get_stock_price, get_gold_price
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()

@app.get("/portfolio/holdings")
def list_holdings(session: Session = Depends(get_session)):
    return get_holdings(session)

@app.post("/portfolio/holdings", status_code=201)
def create_holding(data: HoldingCreate, session: Session = Depends(get_session)):
    return add_holding(session, data)

@app.put("/portfolio/holdings/{holding_id}")
def edit_holding(holding_id: int, data: HoldingUpdate, session: Session = Depends(get_session)):
    holding = update_holding(session, holding_id, data)
    if not holding:
        raise HTTPException(404, "Holding not found")
    return holding

@app.delete("/portfolio/holdings/{holding_id}")
def remove_holding(holding_id: int, session: Session = Depends(get_session)):
    ok = delete_holding(session, holding_id)
    if not ok:
        raise HTTPException(404, "Holding not found")
    return {"ok": True}

@app.get("/portfolio/summary")
def portfolio_summary(session: Session = Depends(get_session)):
    holdings = get_holdings(session)
    if not holdings:
        return {
            "total_invested": 0,
            "current_value": 0,
            "profit_loss": 0,
            "roi_percent": 0,
            "annual_return": 0,
            "annualized_return": 0,
            "allocation_by_category": {},
            "best_performing": None,
            "worst_performing": None,
        }
    return calculate_portfolio(holdings)

@app.get("/ai/advice")
def ai_advice(session: Session = Depends(get_session)):
    holdings = get_holdings(session)
    if not holdings:
        return {"advice": []}
    summary = calculate_portfolio(holdings)
    advice = generate_advice(summary)
    return {"advice": advice}

# Market endpoints (optional, can be used directly by frontend)
@app.get("/market/fx/{pair}")
async def get_fx(pair: str):
    # pair e.g., "EURUSD"
    from_cur = pair[:3]
    to_cur = pair[3:]
    rate = await get_fx_rate(from_cur, to_cur)
    if rate is None:
        raise HTTPException(404, "FX rate not found")
    return {"pair": pair, "rate": rate}

@app.get("/market/price/{symbol}")
async def get_price(symbol: str):
    # Route to correct API based on symbol type
    # Simple heuristic: if symbol contains "usd" it's a stooq stock; else try crypto
    if symbol in ["xauusd"] or "." in symbol:
        price = await get_stock_price(symbol)
    else:
        price = await get_crypto_price(symbol)
    if price is None:
        raise HTTPException(404, "Price not found")
    return {"symbol": symbol, "price": price}