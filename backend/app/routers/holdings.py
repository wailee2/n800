from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.holding import Holding
from app.models.portfolio import Portfolio
from app.schemas.holding import HoldingCreate, HoldingRead, HoldingUpdate
from app.services.valuation import calculate_holding_current_value, calculate_holding_initial_value

router = APIRouter()


@router.post("", response_model=HoldingRead, status_code=status.HTTP_201_CREATED)
def create_holding(payload: HoldingCreate, db: Session = Depends(get_db)):
    portfolio = db.query(Portfolio).filter(Portfolio.id == payload.portfolio_id).first()
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")

    data = payload.model_dump()
    data["category"] = data["category"].upper()
    holding = Holding(**data)
    db.add(holding)
    db.commit()
    db.refresh(holding)
    return _attach_derived_values(holding)


@router.get("", response_model=list[HoldingRead])
def list_holdings(portfolio_id: int | None = None, db: Session = Depends(get_db)):
    query = db.query(Holding)
    if portfolio_id is not None:
        query = query.filter(Holding.portfolio_id == portfolio_id)
    holdings = query.all()
    return [_attach_derived_values(holding) for holding in holdings]


@router.get("/{holding_id}", response_model=HoldingRead)
def get_holding(holding_id: int, db: Session = Depends(get_db)):
    holding = db.query(Holding).filter(Holding.id == holding_id).first()
    if not holding:
        raise HTTPException(status_code=404, detail="Holding not found")
    return _attach_derived_values(holding)


@router.patch("/{holding_id}", response_model=HoldingRead)
def update_holding(holding_id: int, payload: HoldingUpdate, db: Session = Depends(get_db)):
    holding = db.query(Holding).filter(Holding.id == holding_id).first()
    if not holding:
        raise HTTPException(status_code=404, detail="Holding not found")

    update_data = payload.model_dump(exclude_unset=True)
    if "category" in update_data and update_data["category"] is not None:
        update_data["category"] = update_data["category"].upper()

    for key, value in update_data.items():
        setattr(holding, key, value)

    db.commit()
    db.refresh(holding)
    return holding