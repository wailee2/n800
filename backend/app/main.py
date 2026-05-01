from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.routers.dashboard import router as dashboard_router
from app.routers.health import router as health_router
from app.routers.holdings import router as holdings_router
from app.routers.portfolios import router as portfolios_router

app = FastAPI(title="N800 Portfolio Manager")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router, prefix="/api", tags=["health"])
app.include_router(portfolios_router, prefix="/api/portfolios", tags=["portfolios"])
app.include_router(holdings_router, prefix="/api/holdings", tags=["holdings"])
app.include_router(dashboard_router, prefix="/api/dashboard", tags=["dashboard"])


@app.get("/")
def root():
    return {"message": "N800 API is running"}