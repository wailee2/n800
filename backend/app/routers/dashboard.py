from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.holding import Holding
from app.models.portfolio import Portfolio
from app.schemas.dashboard import AdviceCard, CategoryBreakdownItem, DashboardSummary
from app.services.valuation import summarize_portfolio

router = APIRouter()


@router.get("", response_model=DashboardSummary)
def get_dashboard(portfolio_id: int, db: Session = Depends(get_db)):
    portfolio = db.query(Portfolio).filter(Portfolio.id == portfolio_id).first()
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")

    holdings = db.query(Holding).filter(Holding.portfolio_id == portfolio_id).all()
    summary = summarize_portfolio(portfolio, holdings)

    advice = [
        AdviceCard(
            title="Rebalance exposure",
            message="Review category concentration and keep the portfolio balanced.",
            priority="medium",
        ),
        AdviceCard(
            title="Keep liquidity",
            message="Maintain enough fiat for short-term flexibility and opportunities.",
            priority="high",
        ),
        AdviceCard(
            title="Review growth trend",
            message="Check which holding is driving performance and whether it remains healthy.",
            priority="low",
        ),
    ]

    return DashboardSummary(
        **summary,
        category_breakdown=[CategoryBreakdownItem(**item) for item in summary["category_breakdown"]],
        advice=advice,
    )