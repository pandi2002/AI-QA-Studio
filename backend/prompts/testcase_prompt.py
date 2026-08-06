def build_testcase_prompt(
    requirement: str,
    testing_types: list[str],
    design_techniques: list[str],
    image_analysis: str = ""
):

    testing_section = "\n".join(
        f"- {item}" for item in testing_types
    )

    design_section = "\n".join(
        f"- {item}" for item in design_techniques
    )

    prompt = f"""
You are a Senior QA Architect with over 15 years of experience.

Your responsibility is to generate COMPLETE software test coverage.

==================================================
Requirement
==================================================

{requirement if requirement else "No textual requirement provided."}

==================================================
Detected UI Analysis
==================================================

{image_analysis if image_analysis else "No UI screenshots were uploaded."}

==================================================
Generate ONLY these testing categories
==================================================

{testing_section}

==================================================
Apply these design techniques
==================================================

{design_section}

==================================================
Instructions
==================================================

1. Generate ONLY the selected testing categories.
2. Cover every business flow.
3. Cover all validations.
4. Cover all fields.
5. Cover all buttons.
6. Cover all dropdowns.
7. Cover all tables.
8. Cover all filters.
9. Cover all searches.
10. Cover all pagination.
11. Cover CRUD.
12. Cover navigation.
13. Cover business rules.
14. Cover edge cases.
15. Cover everything visible in uploaded screenshots.
16. Generate detailed execution steps for every test case.
17. Each execution step should include the expected system behaviour immediately after that action is performed.
18. The expected result should correspond only to that execution step, allowing the tester to verify each step independently.
19. Do NOT generate one overall expected result for the entire test case.
20. If multiple design techniques are selected,choose the most appropriate one for each test case.

==================================================
IMPORTANT
==================================================

Return ONLY valid JSON.

Do NOT return markdown.

Do NOT return HTML.

Do NOT return explanations.

Do NOT wrap the JSON inside triple backticks.

The JSON MUST follow this schema exactly.

Every test case MUST contain values for ALL fields.

Never return:
- None
- null
- ""
- N/A

Rules:

1. category MUST be one of the selected testing categories.
2. priority MUST always be one of:
   - High
   - Medium
   - Low
3. designTechnique MUST be one of the selected design techniques.
4. module MUST never be empty.
5. scenario MUST never be empty.
6. preconditions MUST contain at least one item.
7. steps MUST contain at least one action.
8. Every step MUST contain:
   - action
   - expectedResult
9. testData MUST never be empty.
   If no test data is required, return:
   "No specific test data required."

If multiple design techniques are selected, choose the most appropriate one for each individual test case.

Generate professional QA test cases.

The JSON MUST follow this schema exactly.

{{
  "module": "Module Name",
  "testCases": [
    {{
      "testCaseId": "TC-001",
      "category": "Positive",
      "priority": "High",
      "scenario": "Scenario",
      "preconditions": [
        "..."
      ],
      "steps": [
      {{"action": "Describe the execution step.",
          "expectedResult": "Describe the expected behaviour for this execution step."
        }}
      ],
      "testData": "...",
      "designTechnique": ""One of the selected design techniques""
    }}
  ]
}}

Return ONLY valid JSON.
"""

    return prompt