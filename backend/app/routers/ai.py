from fastapi import APIRouter

from app.schemas.advice import AdviceRequest, AdviceResponse
from app.services.gemini_ai import generate_advice

router = APIRouter()


@router.post("/advice", response_model=AdviceResponse)
def create_advice(payload: AdviceRequest):
    summary = payload.model_dump()
    advice = generate_advice(summary)
    return {"advice": advice}