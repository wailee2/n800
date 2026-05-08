# services/ai_service.py
from google import genai
from google.genai import types
from pydantic import BaseModel, Field
from config import Config

client = genai.Client(api_key=Config.GEMINI_API_KEY)


class AdviceResponse(BaseModel):
    advices: list[str] = Field(description="Exactly 3 concise portfolio advice items.")


def generate_advice(portfolio_json):
    prompt = f"""
You are a financial advisor AI.

Use only the portfolio data below:
{portfolio_json}

Return exactly 3 concise, actionable, specific advices.
They must be based on the portfolio data, not generic.
"""

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=AdviceResponse,
            ),
        )

        parsed = response.parsed
        if parsed and parsed.advices:
            advices = parsed.advices[:3]
            while len(advices) < 3:
                advices.append("Review your asset allocation for better diversification.")
            return advices

        raise ValueError("Gemini returned no parsed advice")

    except Exception as e:
        print("AI error:", e)
        return [
            "Diversify your holdings across different asset classes.",
            "Rebalance your portfolio quarterly to maintain target allocations.",
            "Hold a small cash buffer for flexibility and risk control.",
        ]