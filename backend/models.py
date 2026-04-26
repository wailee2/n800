from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import date

class Holding(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    category: str                   # "fiat", "asset", "gold"
    symbol: str
    quantity: float
    buy_price: float
    current_price: float = 0.0
    buy_date: date
    notes: Optional[str] = ""