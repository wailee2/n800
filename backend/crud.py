from sqlmodel import Session, select
from models import Holding
from schemas import HoldingCreate, HoldingUpdate

def get_holdings(session: Session) -> list[Holding]:
    return session.exec(select(Holding)).all()

def add_holding(session: Session, data: HoldingCreate) -> Holding:
    holding = Holding(**data.model_dump())
    session.add(holding)
    session.commit()
    session.refresh(holding)
    return holding

def update_holding(session: Session, holding_id: int, data: HoldingUpdate) -> Holding | None:
    holding = session.get(Holding, holding_id)
    if not holding:
        return None
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(holding, field, value)
    session.commit()
    session.refresh(holding)
    return holding

def delete_holding(session: Session, holding_id: int) -> bool:
    holding = session.get(Holding, holding_id)
    if not holding:
        return False
    session.delete(holding)
    session.commit()
    return True