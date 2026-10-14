from groq import AsyncGroq

from app.core.config import settings

client  = AsyncGroq(api_key = settings.GROQ_API_KEY)

async def generate_response(prompt: str) -> str:
    response = await client.chat.completions.create(
        model=settings.GROQ_MODEL,
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.2
    )

    content = response.choices[0].message.content

    if not content:
        raise RuntimeError("Groq returned an empty response")

    return content