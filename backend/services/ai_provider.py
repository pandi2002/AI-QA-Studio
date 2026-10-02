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
    if result is None:
        raise Exception("AI Provider returned an empty response. Please check your API key or model availability.")

    raw = str(result).strip()
    if not raw:
        raise Exception("AI Provider returned empty text. Please try generating again.")

    # Strip code block fences
    if "```json" in raw:
        raw = raw.split("```json", 1)[1]
        if "```" in raw:
            raw = raw.rsplit("```", 1)[0]
    elif "```typescript" in raw:
        raw = raw.split("```typescript", 1)[1]
        if "```" in raw:
            raw = raw.rsplit("```", 1)[0]
    elif "```sql" in raw:
        raw = raw.split("```sql", 1)[1]
        if "```" in raw:
            raw = raw.rsplit("```", 1)[0]
    elif "```" in raw:
        raw = raw.split("```", 1)[1]
        if "```" in raw:
            raw = raw.rsplit("```", 1)[0]

    raw = raw.strip()

    # Stage 1: Standard JSON parse
    try:
        parsed = json.loads(raw)
        if isinstance(parsed, list):
            return {"module": "Test Suite", "testCases": parsed}
        if isinstance(parsed, dict):
            if "test_cases" in parsed and "testCases" not in parsed:
                parsed["testCases"] = parsed.pop("test_cases")
            return parsed
    except Exception:
        pass

    # Stage 2: Automatic bracket & quote repair for truncated responses
    repaired = raw
    if repaired.count('"') % 2 != 0:
        repaired += '"'

    open_brackets = repaired.count('[') - repaired.count(']')
    open_braces = repaired.count('{') - repaired.count('}')

    repaired += ']' * max(0, open_brackets)
    repaired += '}' * max(0, open_braces)

    try:
        parsed = json.loads(repaired)
        if isinstance(parsed, list):
            return {"module": "Test Suite", "testCases": parsed}
        if isinstance(parsed, dict):
            if "test_cases" in parsed and "testCases" not in parsed:
                parsed["testCases"] = parsed.pop("test_cases")
            return parsed
    except Exception:
        pass

    # Stage 3: Balanced-brace extraction of test cases for truncated JSON
    tc_match = re.search(r'"(?:testCases|test_cases)"\s*:\s*\[', raw)
    if tc_match:
        start_idx = tc_match.end()
        valid_items = []
        
        i = start_idx
        while i < len(raw):
            while i < len(raw) and raw[i] != '{':
                i += 1
            if i >= len(raw):
                break
            
            obj_start = i
            brace_count = 0
            in_string = False
            escape = False
            
            while i < len(raw):
                ch = raw[i]
                if escape:
                    escape = False
                elif ch == '\\' and in_string:
                    escape = True
                elif ch == '"':
                    in_string = not in_string
                elif not in_string:
                    if ch == '{':
                        brace_count += 1
                    elif ch == '}':
                        brace_count -= 1
                        if brace_count == 0:
                            obj_str = raw[obj_start:i+1]
                            try:
                                valid_items.append(json.loads(obj_str))
                            except Exception:
                                obj_repaired = obj_str
                                if obj_repaired.count('"') % 2 != 0:
                                    obj_repaired += '"'
                                obj_repaired += '}' * (obj_repaired.count('{') - obj_repaired.count('}'))
                                try:
                                    valid_items.append(json.loads(obj_repaired))
                                except Exception:
                                    pass
                            break
                i += 1
            i += 1
            
        if valid_items:
            mod_match = re.search(r'"module"\s*:\s*"([^"]+)"', raw)
            module_name = mod_match.group(1) if mod_match else "Test Suite"
            return {"module": module_name, "testCases": valid_items}

    # Stage 4: Extract Playwright code if present
    code_match = re.search(r'"code"\s*:\s*"(.*)"', raw, re.DOTALL)
    if code_match:
        return {"code": code_match.group(1)}

    # Stage 5: Extract SQL if present
    sql_match = re.search(r'"sql"\s*:\s*"(.*)"', raw, re.DOTALL)
    if sql_match:
        return {"sql": sql_match.group(1)}

    # Stage 6: Fallback for raw TypeScript / Playwright code
    if any(k in raw for k in ["import ", "test(", "describe(", "expect(", "page."]):
        return {"code": raw}

    # Stage 7: Fallback for raw SQL queries
    if any(raw.upper().startswith(k) for k in ["SELECT", "INSERT", "UPDATE", "DELETE", "CREATE", "WITH"]):
        return {"sql": raw}

    raise Exception("Invalid or truncated response from AI provider. Please try generating again.")



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