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