from pydantic import BaseModel, Field


class AdviceItem(BaseModel):
    title: str = Field(min_length=1, max_length=120)
    message: str = Field(min_length=1, max_length=300)
    priority: str = Field(min_length=1, max_length=20)


class AdviceRequest(BaseModel):
    portfolio_name: str
    base_currency: str
    total_initial_value: float
    total_current_value: float
    profit_loss: float
    roi_percent: float
    yearly_return: float
    category_breakdown: list[dict]


class AdviceResponse(BaseModel):
    advice: list[AdviceItem]