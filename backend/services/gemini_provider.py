import os

from google import genai
from dotenv import load_dotenv 

load_dotenv()

gemini_client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

async def generate_response(prompt: str):

    response = gemini_client.models.generate_content(
        model=os.getenv("GEMINI_MODEL"),
        contents=prompt,
    )

    return response.text.strip()

