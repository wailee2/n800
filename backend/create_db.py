from app.db.base import Base
from app.db.session import engine
from app.models.portfolio import Portfolio
from app.models.holding import Holding

Base.metadata.create_all(bind=engine)
print("Database tables created successfully.")