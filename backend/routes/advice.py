#routes/advice.py
from flask import Blueprint, jsonify
from utils.auth_decorator import token_required
from models import Asset
from services.ai_service import generate_advice
from services.price_service import fetch_current_price
from datetime import datetime

advice_bp = Blueprint('advice', __name__)

@advice_bp.route('/advice', methods=['GET'])
@token_required
def get_advice(user_id):
    assets = Asset.query.filter_by(user_id=user_id).all()
    portfolio_info = []
    total_value = 0.0
    total_invested = 0.0
    for a in assets:
        price = fetch_current_price(a.type, a.symbol)
        if price is None:
            price = 0.0
        current_val = a.quantity * price
        invested = a.quantity * a.purchase_price
        total_value += current_val
        total_invested += invested
        portfolio_info.append(f"{a.name} ({a.type}): quantity={a.quantity}, bought at ${a.purchase_price}, current price ${price:.2f}, current value ${current_val:.2f}")

    summary = {
        "total_value": round(total_value, 2),
        "total_invested": round(total_invested, 2),
        "roi_percent": round(((total_value - total_invested) / total_invested) * 100, 2) if total_invested else 0,
        "assets": portfolio_info
    }

    advices = generate_advice(summary)
    return jsonify({
        'portfolio_summary': summary,
        'advices': advices
    }), 200