from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class HoldingBase(BaseModel):
    portfolio_id: int
    name: str = Field(min_length=1, max_length=100)
    category: str = Field(min_length=1, max_length=20)
    quantity: float = Field(ge=0)
    purchase_price: float = Field(ge=0)
    current_price: float = Field(ge=0)
    notes: str | None = Field(default=None, max_length=1000)


class HoldingCreate(HoldingBase):
    pass


class HoldingUpdate(BaseModel):
    portfolio_id: int | None = None
    name: str | None = Field(default=None, min_length=1, max_length=100)
    category: str | None = Field(default=None, min_length=1, max_length=20)
    quantity: float | None = Field(default=None, ge=0)
    purchase_price: float | None = Field(default=None, ge=0)
    current_price: float | None = Field(default=None, ge=0)
    notes: str | None = Field(default=None, max_length=1000)


class HoldingRead(HoldingBase):
    id: int
    initial_value: float
    current_value: float
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)