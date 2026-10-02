import os
import re
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
        raise Exception("Neither ANTHROPIC_API_KEY nor OPENROUTER_API_KEY is configured in backend environment variables. Please set ANTHROPIC_API_KEY or OPENROUTER_API_KEY under Render Environment Variables.")

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
        tokens_to_try = [max_t, 1800, 1500, 1000, 800, 500, 300, 150]
        idx = 0
        last_error = ""

        while idx < len(tokens_to_try):
            max_tokens_try = tokens_to_try[idx]
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
                choices = data.get("choices", [])
                if choices and len(choices) > 0:
                    msg = choices[0].get("message", {})
                    content = msg.get("content") or ""
                    return content.strip()
                return ""
            elif res.status_code == 402:
                last_error = res.text
                print(f"[OpenRouter] Status 402 with max_tokens={max_tokens_try}: {res.text}")
                # Parse exact affordable tokens from OpenRouter error message
                afford_match = re.search(r"can only afford (\d+)", res.text)
                if afford_match:
                    afford_val = int(afford_match.group(1))
                    if afford_val > 50 and afford_val < max_tokens_try:
                        next_val = max(50, afford_val - 10)
                        # Check if next_val isn't already in list
                        if next_val not in tokens_to_try:
                            tokens_to_try.insert(idx + 1, next_val)
                idx += 1
            else:
                raise Exception(f"OpenRouter Claude API Error ({res.status_code}): {res.text}")

        raise Exception("OpenRouter Claude API Error (402): Your OpenRouter key credit balance is too low for this request. Please add credits at https://openrouter.ai/settings/credits or switch provider to Gemini / Groq.")

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

    if not response.content or len(response.content) == 0:
        return ""

    text = response.content[0].text or ""
    return text.strip()
