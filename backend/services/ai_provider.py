import json

from services import gemini_provider, groq_provider

from prompts.testcase_prompt import build_testcase_prompt
from prompts.playwright_prompt import build_playwright_prompt
from prompts.review_prompt import build_review_prompt
from services.image_analyzer import analyze_ui_images


def get_provider(provider: str):
    provider = provider.lower()

    print("\n========== AI Provider ==========")
    print(f"Using Provider : {provider}")
    print("=================================\n")

    if provider == "gemini":
        return gemini_provider

    elif provider == "groq":
        return groq_provider

    raise Exception(f"Unsupported Provider : {provider}")


def parse_json(result: str):

    if result.startswith("```json"):
        result = result.replace("```json", "", 1)

    if result.endswith("```"):
        result = result[:-3]

    result = result.strip()

    return json.loads(result)


async def generate_testcases(

    provider,
    requirement,
    testing_types,
    design_techniques,
    images,

):

    image_analysis = await analyze_ui_images(images)

    prompt = build_testcase_prompt(

        requirement=requirement,

        testing_types=testing_types,

        design_techniques=design_techniques,

        image_analysis=image_analysis,

    )

    service = get_provider(provider)

    result = await service.generate_response(prompt)

    return parse_json(result)


async def generate_playwright(

    provider,
    requirement,
    testcase_data,

):

    prompt = build_playwright_prompt(
        requirement=requirement,
        testcase_data=testcase_data
    )

    service = get_provider(provider)

    result = await service.generate_response(prompt)

    return parse_json(result)

async def generate_review(

    provider,
    testcase_data,

):

    prompt = build_review_prompt(testcase_data)

    service = get_provider(provider)

    result = await service.generate_response(prompt)

    return parse_json(result)

async def generate_json(provider: str, prompt: str):
    service = get_provider(provider)
    result = await service.generate_response(prompt)
    return parse_json(result)