from pydantic import BaseModel
from typing import Optional
from datetime import date

class HoldingCreate(BaseModel):
    name: str
    category: str
    symbol: str
    quantity: float
    buy_price: float
    current_price: Optional[float] = 0.0
    buy_date: date
    notes: Optional[str] = ""

class HoldingUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    symbol: Optional[str] = None
    quantity: Optional[float] = None
    buy_price: Optional[float] = None
    current_price: Optional[float] = None
    buy_date: Optional[date] = None
    notes: Optional[str] = None

class PortfolioSummary(BaseModel):
    total_invested: float
    current_value: float
    profit_loss: float
    roi_percent: float
    annual_return: float
    allocation_by_category: dict
    best_performing: Optional[dict]
    worst_performing: Optional[dict]