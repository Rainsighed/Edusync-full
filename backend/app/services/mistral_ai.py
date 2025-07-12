import httpx
from ..config import settings

async def analyze_lesson(text: str):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://api.mistral.ai/v1/chat/completions",
            headers={"Authorization": f"Bearer {settings.mistral_api_key}"},
            json={
                "model": "mistral-medium",
                "messages": [
                    {"role": "system", "content": "You are an expert teacher assistant."},
                    {"role": "user", "content": text}
                ]
            }
        )
        response.raise_for_status()
        return response.json()