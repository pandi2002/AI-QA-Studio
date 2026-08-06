import json


def build_sql_prompt(requirement=None, testcase_data=None):

    if testcase_data:

        input_section = f"""
==================================================
Generated Test Cases
==================================================

{json.dumps(testcase_data, indent=2)}

Generate SQL verification queries based on these test cases.
"""

    else:

        input_section = f"""
==================================================
Software Requirement
==================================================

{requirement}

Generate SQL verification queries directly from this requirement.
"""

    prompt = f"""
You are a Senior QA Database Testing Engineer with 15+ years of experience.

Generate professional SQL verification queries.

==================================================
Instructions
==================================================

1. Generate ONLY SELECT queries.
2. Do NOT generate INSERT, UPDATE, DELETE unless it is clearly for cleanup.
3. Assume database tables exist.
4. Use meaningful table and column names if unknown.
5. Add SQL comments before every query.
6. Generate multiple verification queries whenever applicable.
7. Return ONLY JSON.
8. Do NOT return Markdown.
9. Do NOT wrap with ```.

==================================================
JSON Schema
==================================================

{{
    "sql":"Generated SQL Queries"
}}

{input_section}

Return ONLY valid JSON.
"""

    return prompt