import base64
import os
from groq import Groq
from dotenv import load_dotenv

from google import genai
from google.genai import types
from services.groq_provider import groq_client

load_dotenv()
gemini_client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

async def analyze_ui_images(images):

    provider = os.getenv("AI_PROVIDER", "gemini").lower()

    if provider == "gemini":
        return await analyze_with_gemini(images)

    elif provider == "groq":
        return await analyze_with_groq(images)

    elif provider in ("claude", "anthropic"):
        return await analyze_with_claude(images)

    else:
        raise Exception(f"Unsupported provider: {provider}")



# -------------------------
# Gemini
# -------------------------

async def analyze_with_gemini(images):

    if not images:
        return ""

    contents = []

    prompt = """
You are a Senior QA Engineer.

Analyze the uploaded UI screenshots.

Identify every visible UI component.

Return:

1. Screen Name
2. Business Purpose
3. All UI Controls
4. Validations
5. Missing Validations
6. Business Flow

Return markdown only.
"""

    contents.append(prompt)

    for image in images:

        image_bytes = await image.read()

        contents.append(
            types.Part.from_bytes(
                data=image_bytes,
                mime_type=image.content_type
            )
        )

    response = gemini_client.models.generate_content(
        model=os.getenv("GEMINI_MODEL"),
        contents=contents,
    )

    return response.text


# -------------------------
# Groq
# -------------------------

async def analyze_with_groq(images):

    if not images:
        return ""

    prompt = """
You are a Senior QA Engineer.

Analyze the uploaded UI screenshots.

Identify every visible UI component.

Return:

1. Screen Name
2. Business Purpose
3. All UI Controls
4. Validations
5. Missing Validations
6. Business Flow

Return markdown only.
"""

    messages = [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": prompt
                }
            ]
        }
    ]

    for image in images:
        image_bytes = await image.read()
        base64_image = base64.b64encode(image_bytes).decode("utf-8")
        messages[0]["content"].append(
        {
            "type": "image_url",
            "image_url": {
                "url": f"data:{image.content_type};base64,{base64_image}"
            }
        }
    )

        response = groq_client.chat.completions.create(
            model=os.getenv("GROQ_MODEL"),
            messages=messages,
            temperature=0.3,
        )

    return response.choices[0].message.content


# -------------------------
# Claude
# -------------------------

async def analyze_with_claude(images):

    if not images:
        return ""

    key = (
        os.getenv("ANTHROPIC_API_KEY") or
        os.getenv("OPENROUTER_API_KEY") or
        os.getenv("CLAUDE_API_KEY")
    )
    if not key:
        raise Exception("Neither ANTHROPIC_API_KEY nor OPENROUTER_API_KEY is configured in backend environment variables.")

    prompt = """
You are a Senior QA Engineer.

Analyze the uploaded UI screenshots.

Identify every visible UI component.

Return:

1. Screen Name
2. Business Purpose
3. All UI Controls
4. Validations
5. Missing Validations
6. Business Flow

Return markdown only.
"""

    if key.startswith("sk-or-v1-"):
        import requests
        model = os.getenv("CLAUDE_MODEL") or "anthropic/claude-sonnet-5.5"
        url = "https://openrouter.ai/api/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://ai-qa-studio.onrender.com",
            "X-Title": "AI QA Studio",
        }
        content = [{"type": "text", "text": prompt}]
        for image in images:
            image_bytes = await image.read()
            base64_image = base64.b64encode(image_bytes).decode("utf-8")
            content.append({
                "type": "image_url",
                "image_url": {
                    "url": f"data:{image.content_type or 'image/png'};base64,{base64_image}"
                }
            })
        max_t = int(os.getenv("CLAUDE_MAX_TOKENS", "2000"))
        for max_tokens_try in [max_t, 1800, 1500, 1000]:
            payload = {
                "model": model,
                "max_tokens": max_tokens_try,
                "messages": [{"role": "user", "content": content}],
                "temperature": 0.3
            }
            res = requests.post(url, headers=headers, json=payload, timeout=60)
            if res.status_code == 200:
                data = res.json()
                return data["choices"][0]["message"]["content"]
            elif res.status_code == 402 and max_tokens_try > 1000:
                print(f"[OpenRouter Vision] Status 402 with max_tokens={max_tokens_try}, retrying with lower limit...")
                continue
            else:
                raise Exception(f"OpenRouter Claude Vision Error ({res.status_code}): {res.text}")


    try:
        import anthropic
    except ImportError:
        raise Exception("The 'anthropic' package is missing on backend.")

    client = anthropic.Anthropic(api_key=key)
    claude_model = os.getenv("CLAUDE_MODEL", "claude-3-5-sonnet-20241022")

    content = []
    for image in images:
        image_bytes = await image.read()
        base64_image = base64.b64encode(image_bytes).decode("utf-8")
        content.append({
            "type": "image",
            "source": {
                "type": "base64",
                "media_type": image.content_type or "image/png",
                "data": base64_image,
            }
        })

    content.append({
        "type": "text",
        "text": prompt
    })

    response = client.messages.create(
        model=claude_model,
        max_tokens=4096,
        messages=[
            {
                "role": "user",
                "content": content
            }
        ]
    )

    return response.content[0].text
