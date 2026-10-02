import os
import requests
from dotenv import load_dotenv

load_dotenv()

claude_key = (
    os.getenv("ANTHROPIC_API_KEY") or
    os.getenv("OPENROUTER_API_KEY") or
    os.getenv("CLAUDE_API_KEY")
)


async def generate_response(prompt: str):
    key = (
        os.getenv("ANTHROPIC_API_KEY") or
        os.getenv("OPENROUTER_API_KEY") or
        os.getenv("CLAUDE_API_KEY") or
        claude_key
    )

    if not key:
        raise Exception("Neither ANTHROPIC_API_KEY nor OPENROUTER_API_KEY is configured in backend environment variables. Please set ANTHROPIC_API_KEY under Render Environment Variables.")

    # OpenRouter API key route
    if key.startswith("sk-or-v1-"):
        model = os.getenv("CLAUDE_MODEL") or "anthropic/claude-sonnet-5.5"
        url = "https://openrouter.ai/api/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://ai-qa-studio.onrender.com",
            "X-Title": "AI QA Studio",
        }

        max_t = int(os.getenv("CLAUDE_MAX_TOKENS", "2000"))
        for max_tokens_try in [max_t, 1800, 1500, 1000]:
            payload = {
                "model": model,
                "max_tokens": max_tokens_try,
                "messages": [
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                "temperature": 0.3
            }
            res = requests.post(url, headers=headers, json=payload, timeout=60)
            if res.status_code == 200:
                data = res.json()
                return data["choices"][0]["message"]["content"].strip()
            elif res.status_code == 402 and max_tokens_try > 1000:
                print(f"[OpenRouter] Status 402 with max_tokens={max_tokens_try}, retrying with lower limit...")
                continue
            else:
                raise Exception(f"OpenRouter Claude API Error ({res.status_code}): {res.text}")


    # Direct Anthropic API route
    try:
        import anthropic
    except ImportError:
        raise Exception("The 'anthropic' package is missing on backend. Please install anthropic.")

    model = os.getenv("CLAUDE_MODEL") or "claude-3-5-sonnet-20241022"
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


