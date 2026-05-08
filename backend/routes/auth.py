#routes/auth.py
from flask import Blueprint, request, jsonify
from models import db, User
from config import Config
import jwt
from datetime import datetime, timedelta

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["POST"])
def register():
    if User.query.count() >= Config.MAX_USERS:
        return jsonify({"error": "Maximum number of users reached"}), 403

    data = request.get_json() or {}
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password required"}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already exists"}), 409

    user = User(username=username, password=password)
    db.session.add(user)
    db.session.commit()

    token = jwt.encode(
        {
            "user_id": user.id,
            "exp": datetime.utcnow() + timedelta(days=7),
        },
        Config.SECRET_KEY,
        algorithm="HS256",
    )

    return jsonify({"token": token, "user_id": user.id}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password required"}), 400

    user = User.query.filter_by(username=username).first()
    if not user or user.password != password:
        return jsonify({"error": "Invalid credentials"}), 401

    token = jwt.encode(
        {
            "user_id": user.id,
            "exp": datetime.utcnow() + timedelta(days=7),
        },
        Config.SECRET_KEY,
        algorithm="HS256",
    )

    return jsonify({"token": token, "user_id": user.id}), 200