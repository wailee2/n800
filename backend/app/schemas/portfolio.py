from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class PortfolioBase(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    base_currency: str = Field(default="USD", min_length=1, max_length=10)


class PortfolioCreate(PortfolioBase):
    pass


class PortfolioUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=100)
    base_currency: str | None = Field(default=None, min_length=1, max_length=10)


class PortfolioRead(PortfolioBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)