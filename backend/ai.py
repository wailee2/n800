import httpx
import os
import json

OLLAMA_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")

def generate_advice(portfolio_summary: dict) -> list[str]:
    prompt = f"""
You are a financial advisor. Based on this portfolio summary:
Total invested: {portfolio_summary['total_invested']}
Current value: {portfolio_summary['current_value']}
ROI: {portfolio_summary['roi_percent']}%
Category allocation: {portfolio_summary['allocation_by_category']}
Best holding: {portfolio_summary['best_performing']}
Worst holding: {portfolio_summary['worst_performing']}

Give exactly 3 short, actionable pieces of advice (each 1-2 sentences).
The advice must directly reference the data above. Do not number them, just use newlines.
"""
    payload = {
        "model": "llama3.2",
        "prompt": prompt,
        "stream": False
    }
    try:
        resp = httpx.post(f"{OLLAMA_URL}/api/generate", json=payload, timeout=30.0)
        if resp.status_code == 200:
            text = resp.json()["response"].strip()
            lines = [line.strip("- ").strip() for line in text.split("\n") if line.strip()]
            return lines[:3]
    except Exception as e:
        print("AI error:", e)
    return [
        "Consider rebalancing your portfolio to reduce overexposure to a single category.",
        "Look for opportunities to invest in assets with higher annualized returns.",
        "Keep an emergency fund in stable fiat to cushion against market dips."
    ]