from collections import defaultdict

from app.services.roi import calculate_profit_loss, calculate_roi, calculate_yearly_return


def calculate_holding_initial_value(quantity: float, purchase_price: float) -> float:
    return quantity * purchase_price


def calculate_holding_current_value(quantity: float, current_price: float) -> float:
    return quantity * current_price


def summarize_portfolio(portfolio, holdings):
    category_totals = defaultdict(float)
    total_initial_value = 0.0
    total_current_value = 0.0

    for holding in holdings:
        initial_value = calculate_holding_initial_value(holding.quantity, holding.purchase_price)
        current_value = calculate_holding_current_value(holding.quantity, holding.current_price)

        total_initial_value += initial_value
        total_current_value += current_value
        category_totals[holding.category.upper()] += current_value

    profit_loss = calculate_profit_loss(total_initial_value, total_current_value)
    roi_percent = calculate_roi(total_initial_value, total_current_value)
    yearly_return = calculate_yearly_return(total_current_value)

    total_for_percent = total_current_value if total_current_value > 0 else 1
    category_breakdown = [
        {
            "category": category,
            "value": value,
            "percent": (value / total_for_percent) * 100,
        }
        for category, value in category_totals.items()
    ]

    return {
        "portfolio_id": portfolio.id,
        "portfolio_name": portfolio.name,
        "base_currency": portfolio.base_currency,
        "total_initial_value": total_initial_value,
        "total_current_value": total_current_value,
        "profit_loss": profit_loss,
        "roi_percent": roi_percent,
        "yearly_return": yearly_return,
        "category_breakdown": category_breakdown,
    }