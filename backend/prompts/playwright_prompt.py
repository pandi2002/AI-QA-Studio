import json


def build_playwright_prompt(requirement=None, testcase_data=None):

    if testcase_data:

        input_section = f"""
==================================================
Generated Test Cases
==================================================

{json.dumps(testcase_data, indent=2)}

Generate Playwright automation using these test cases.
"""

    else:

        input_section = f"""
==================================================
Software Requirement
==================================================

{requirement}

Generate complete Playwright automation directly from this requirement.
"""

    prompt = f"""
You are a Senior QA Automation Architect with 15+ years of experience in Playwright and TypeScript.

Generate production-ready Playwright automation code.

==================================================
Instructions
==================================================

1. Use Playwright Test framework.
2. Use TypeScript.
3. Generate one test() for every logical scenario.
4. Use async/await.
5. Use expect() assertions.
6. Use process.env.BASE_URL.
7. Use meaningful test names.
8. If UI locators are unknown, use placeholder locators.
9. Add comments where useful.
10. Follow Playwright best practices.
11. Return ONLY valid JSON.
12. Do NOT return Markdown.
13. Do NOT wrap the response inside ```.

==================================================
JSON Schema
==================================================

{{
    "code": "Playwright TypeScript code"
}}

{input_section}

Return ONLY valid JSON.
"""

    return prompt