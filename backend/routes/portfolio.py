#routes/portfolio.py
from flask import Blueprint, request, jsonify
from datetime import datetime

from models import db, Asset
from utils.auth_decorator import token_required
from services.price_service import fetch_current_price

portfolio_bp = Blueprint("portfolio", __name__)


@portfolio_bp.route("/assets", methods=["GET"])
@token_required
def get_assets(user_id):
    assets = Asset.query.filter_by(user_id=user_id).all()
    result = []

    for a in assets:
        result.append({
            "id": a.id,
            "type": a.type,
            "name": a.name,
            "symbol": a.symbol,
            "quantity": a.quantity,
            "purchase_price": a.purchase_price,
            "purchase_date": a.purchase_date.isoformat() if a.purchase_date else None,
            "notes": a.notes,
            "current_price": fetch_current_price(a.type, a.symbol)
        })

    return jsonify(result), 200


@portfolio_bp.route("/assets", methods=["POST"])
@token_required
def add_asset(user_id):
    data = request.get_json() or {}

    required_fields = ["type", "name", "quantity", "purchase_price"]
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    purchase_date = data.get("purchase_date")
    parsed_date = datetime.fromisoformat(purchase_date) if purchase_date else datetime.utcnow()

    asset = Asset(
        user_id=user_id,
        type=data["type"].upper(),
        name=data["name"],
        symbol=data.get("symbol", data["name"]),
        quantity=data["quantity"],
        purchase_price=data["purchase_price"],
        purchase_date=parsed_date,
        notes=data.get("notes", "")
    )

    db.session.add(asset)
    db.session.commit()

    return jsonify({"message": "Asset added", "id": asset.id}), 201


@portfolio_bp.route("/assets/<int:asset_id>", methods=["PUT"])
@token_required
def update_asset(user_id, asset_id):
    asset = Asset.query.filter_by(id=asset_id, user_id=user_id).first()
    if not asset:
        return jsonify({"error": "Asset not found"}), 404

    data = request.get_json() or {}

    if "type" in data:
        asset.type = data["type"].upper()
    if "name" in data:
        asset.name = data["name"]
    if "symbol" in data:
        asset.symbol = data["symbol"]
    if "quantity" in data:
        asset.quantity = data["quantity"]
    if "purchase_price" in data:
        asset.purchase_price = data["purchase_price"]
    if "purchase_date" in data and data["purchase_date"]:
        asset.purchase_date = datetime.fromisoformat(data["purchase_date"])
    if "notes" in data:
        asset.notes = data["notes"]

    db.session.commit()
    return jsonify({"message": "Asset updated"}), 200


@portfolio_bp.route("/assets/<int:asset_id>", methods=["DELETE"])
@token_required
def delete_asset(user_id, asset_id):
    asset = Asset.query.filter_by(id=asset_id, user_id=user_id).first()
    if not asset:
        return jsonify({"error": "Asset not found"}), 404

    db.session.delete(asset)
    db.session.commit()
    return jsonify({"message": "Asset deleted"}), 200