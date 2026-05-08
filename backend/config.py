import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    SECRET_KEY: str = os.getenv("SECRET_KEY") or "dev-secret-key"
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite:///portfolio.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    GOLDAPI_KEY = os.getenv("GOLDAPI_KEY")
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    MAX_USERS = 3