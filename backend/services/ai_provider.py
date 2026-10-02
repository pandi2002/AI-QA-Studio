import json

from services import gemini_provider, groq_provider, claude_provider

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

    elif provider in ("claude", "anthropic"):
        return claude_provider

    raise Exception(f"Unsupported Provider : {provider}")



import re

def parse_json(result: str):
    raw = result.strip()

    # Strip code block fences
    if "```json" in raw:
        raw = raw.split("```json", 1)[1]
        if "```" in raw:
            raw = raw.rsplit("```", 1)[0]
    elif "```" in raw:
        raw = raw.split("```", 1)[1]
        if "```" in raw:
            raw = raw.rsplit("```", 1)[0]

    raw = raw.strip()

    # Stage 1: Standard JSON parse
    try:
        return json.loads(raw)
    except Exception:
        pass

    # Stage 2: Automatic bracket & quote repair for truncated responses
    repaired = raw
    # Fix unclosed string quotes
    if repaired.count('"') % 2 != 0:
        repaired += '"'

    open_brackets = repaired.count('[') - repaired.count(']')
    open_braces = repaired.count('{') - repaired.count('}')

    repaired += ']' * max(0, open_brackets)
    repaired += '}' * max(0, open_braces)

    try:
        return json.loads(repaired)
    except Exception:
        pass

    # Stage 3: Extract valid testCase items using regex
    test_cases_match = re.search(r'"testCases"\s*:\s*\[(.*)', raw, re.DOTALL)
    if test_cases_match:
        items_str = test_cases_match.group(1)
        objects = re.findall(r'\{[^{}]*\}', items_str)
        valid_items = []
        for obj in objects:
            try:
                valid_items.append(json.loads(obj))
            except Exception:
                pass
        if valid_items:
            return {"testCases": valid_items}

    # Stage 4: Extract Playwright code if present
    code_match = re.search(r'"code"\s*:\s*"(.*)"', raw, re.DOTALL)
    if code_match:
        return {"code": code_match.group(1)}

    # Stage 5: Extract SQL if present
    sql_match = re.search(r'"sql"\s*:\s*"(.*)"', raw, re.DOTALL)
    if sql_match:
        return {"sql": sql_match.group(1)}

    raise Exception("Invalid or truncated JSON response from AI provider. Please try generating again.")



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