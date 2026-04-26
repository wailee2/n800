from models import Holding
from datetime import date

def calculate_portfolio(holdings: list[Holding]) -> dict:
    total_invested = 0.0
    current_value = 0.0
    category_value = {"fiat": 0.0, "asset": 0.0, "gold": 0.0}
    best = None
    worst = None

    for h in holdings:
        invested = h.buy_price * h.quantity
        current = h.current_price * h.quantity
        total_invested += invested
        current_value += current
        category_value[h.category] += current

        profit = current - invested
        roi = (profit / invested) * 100 if invested else 0

        perf = {"name": h.name, "symbol": h.symbol, "roi": roi}
        if best is None or roi > best["roi"]:
            best = perf
        if worst is None or roi < worst["roi"]:
            worst = perf

    profit_loss = current_value - total_invested
    roi_percent = (profit_loss / total_invested * 100) if total_invested else 0

    # Annual return (simplified: assume 1 year or use avg hold period)
    # Here we use simple yearly return = current - invested (as per PRD)
    # Better: calculate weighted days held
    years_held = 1.0  # placeholder; you can compute from buy_date
    annualized = (pow(current_value / total_invested, 1/years_held) - 1) * 100 if total_invested else 0

    allocation = {
        cat: (val / current_value * 100) if current_value else 0
        for cat, val in category_value.items()
    }

    return {
        "total_invested": round(total_invested, 2),
        "current_value": round(current_value, 2),
        "profit_loss": round(profit_loss, 2),
        "roi_percent": round(roi_percent, 2),
        "annual_return": round(profit_loss, 2),  # yearly gain estimate as simple diff
        "annualized_return": round(annualized, 2),
        "allocation_by_category": allocation,
        "best_performing": best,
        "worst_performing": worst,
    }