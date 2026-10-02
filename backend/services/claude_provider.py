import os
import anthropic
from dotenv import load_dotenv

load_dotenv()

claude_key = os.getenv("ANTHROPIC_API_KEY") or os.getenv("CLAUDE_API_KEY")
claude_model = os.getenv("CLAUDE_MODEL", "claude-3-5-sonnet-20241022")


async def generate_response(prompt: str):
    key = os.getenv("ANTHROPIC_API_KEY") or os.getenv("CLAUDE_API_KEY") or claude_key
    model = os.getenv("CLAUDE_MODEL") or claude_model

    if not key:
        raise Exception("ANTHROPIC_API_KEY is not configured in backend environment variables.")

    client = anthropic.Anthropic(api_key=key)

    response = client.messages.create(
        model=model,
        max_tokens=4096,
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return response.content[0].text.strip()
