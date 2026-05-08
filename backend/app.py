from flask import Flask, jsonify
from flask_cors import CORS

from config import Config
from models import db

from routes.auth import auth_bp
from routes.portfolio import portfolio_bp
from routes.advice import advice_bp


def create_app():
    app = Flask(__name__)

    # Load configuration
    app.config.from_object(Config)

    # Enable CORS
    CORS(
        app,
        resources={
            r"/api/*": {
                "origins": "*"
            }
        }
    )

    # Initialize database
    db.init_app(app)

    # Create tables
    with app.app_context():
        db.create_all()

    # Register blueprints
    app.register_blueprint(
        auth_bp,
        url_prefix="/api"
    )

    app.register_blueprint(
        portfolio_bp,
        url_prefix="/api"
    )

    app.register_blueprint(
        advice_bp,
        url_prefix="/api"
    )

    # Health check route
    @app.route("/")
    def home():
        return jsonify({
            "message": "Portfolio Manager API running"
        })

    # Simple API status route
    @app.route("/api/status")
    def status():
        return jsonify({
            "status": "success",
            "message": "API is active"
        })

    return app


app = create_app()


if __name__ == "__main__":
    app.run(
        debug=True,
        host="0.0.0.0",
        port=5000
    )