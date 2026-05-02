import json
import os

from app.schemas.advice import AdviceItem


def build_gemini_prompt(summary: dict) -> str:
    return f"""
You are a portfolio assistant.
Analyze the portfolio summary below and return exactly 3 short advice items.
Return only valid JSON in this shape:
{{
  "advice": [
    {{"title": "...", "message": "...", "priority": "high|medium|low"}},
    {{"title": "...", "message": "...", "priority": "high|medium|low"}},
    {{"title": "...", "message": "...", "priority": "high|medium|low"}}
  ]
}}

Portfolio summary:
{json.dumps(summary, indent=2)}
""".strip()


def fallback_advice(summary: dict) -> list[AdviceItem]:
    return [
        AdviceItem(
            title="Rebalance exposure",
            message="Your allocation is concentrated. Consider spreading risk across categories.",
            priority="medium",
        ),
        AdviceItem(
            title="Protect liquidity",
            message="Keep enough fiat available for flexibility and near-term needs.",
            priority="high",
        ),
        AdviceItem(
            title="Review returns",
            message="Check which holding is driving returns and whether the trend is sustainable.",
            priority="low",
        ),
    ]


def generate_advice(summary: dict) -> list[AdviceItem]:
    """
    Placeholder implementation.
    Gemini integration can be wired in here later.
    For now, the app returns stable fallback advice.
    """
    _ = os.getenv("GEMINI_API_KEY", "")
    return fallback_advice(summary)