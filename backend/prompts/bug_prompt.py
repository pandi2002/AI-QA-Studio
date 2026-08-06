import json

from services.ai_provider import generate_json


async def generate_bug_report(
    provider: str,
    requirement: str | None = None,
    testcases: dict | None = None,
):

    if testcases:

        prompt = f"""
You are a Senior QA Engineer.

Based on the following test cases, identify realistic software defects that could be discovered while executing them.

Return ONLY valid JSON.

Format:

{{
    "bugs":[
        {{
            "bugId":"BUG-001",
            "title":"",
            "module":"",
            "severity":"",
            "priority":"",
            "preconditions":"",
            "steps":[
                "Step 1",
                "Step 2"
            ],
            "expectedResult":"",
            "actualResult":"",
            "status":"New"
        }}
    ]
}}

Test Cases:

{json.dumps(testcases, indent=2)}
"""

    elif requirement:

        prompt = f"""
You are a Senior QA Engineer.

Based on the following requirement, identify the most realistic software defect that could occur.

Generate a professional bug report.

Return ONLY valid JSON.

Format:

{{
    "bugs":[
        {{
            "bugId":"BUG-001",
            "title":"",
            "module":"",
            "severity":"",
            "priority":"",
            "preconditions":"",
            "steps":[
                "Step 1",
                "Step 2"
            ],
            "expectedResult":"",
            "actualResult":"",
            "status":"New"
        }}
    ]
}}

Requirement:

{requirement}
"""

    else:
        raise Exception("No input provided.")

    response = await generate_json(provider, prompt)

    return response