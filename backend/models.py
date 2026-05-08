from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)

    username = db.Column(
        db.String(50),
        unique=True,
        nullable=False
    )

    password = db.Column(
        db.String(200),
        nullable=False
    )

    def __init__(self, username, password):
        self.username = username
        self.password = password


class Asset(db.Model):
    __tablename__ = "assets"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    type = db.Column(
        db.String(50),
        nullable=False
    )

    name = db.Column(
        db.String(120),
        nullable=False
    )

    symbol = db.Column(
        db.String(50),
        nullable=False
    )

    quantity = db.Column(
        db.Float,
        nullable=False
    )

    purchase_price = db.Column(
        db.Float,
        nullable=False
    )

    purchase_date = db.Column(
        db.DateTime,
        nullable=False,
        default=datetime.utcnow
    )

    notes = db.Column(
        db.Text,
        default=""
    )

    def __init__(
        self,
        user_id,
        type,
        name,
        symbol,
        quantity,
        purchase_price,
        purchase_date=None,
        notes=""
    ):
        self.user_id = user_id
        self.type = type
        self.name = name
        self.symbol = symbol
        self.quantity = quantity
        self.purchase_price = purchase_price
        self.purchase_date = purchase_date or datetime.utcnow()
        self.notes = notes