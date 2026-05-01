from pydantic import BaseModel


class CategoryBreakdownItem(BaseModel):
    category: str
    value: float
    percent: float


class AdviceCard(BaseModel):
    title: str
    message: str
    priority: str


class DashboardSummary(BaseModel):
    portfolio_id: int
    portfolio_name: str
    base_currency: str
    total_initial_value: float
    total_current_value: float
    profit_loss: float
    roi_percent: float
    yearly_return: float
    category_breakdown: list[CategoryBreakdownItem]
    advice: list[AdviceCard]