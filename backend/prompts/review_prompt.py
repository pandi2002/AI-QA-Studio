import json


def build_review_prompt(testcase_data):

    prompt = f"""
You are a Senior QA Architect with more than 15 years of experience.

Review the generated software test cases.

Analyse them for:

1. Overall Quality
2. Functional Coverage
3. Missing Test Scenarios
4. Boundary Coverage
5. Negative Coverage
6. Security Coverage
7. Performance Coverage
8. Accessibility Coverage
9. Automation Readiness
10. Recommendations

==================================================
Instructions
==================================================

Return ONLY valid JSON.

Do NOT return markdown.

Do NOT return explanations.

==================================================
JSON Schema
==================================================

{{
  "overallScore": 95,
  "quality": "Excellent",
  "coverage": {{
      "functional": "Covered",
      "boundary": "Covered",
      "negative": "Covered",
      "security": "Missing",
      "performance": "Missing",
      "accessibility": "Missing",
      "automation": "Good"
  }},
  "missingScenarios":[
      "...",
      "..."
  ],
  "recommendations":[
      "...",
      "..."
  ],
  "riskLevel":"Medium"
}}

==================================================
Test Cases
==================================================

{json.dumps(testcase_data, indent=2)}

Return ONLY valid JSON.
"""

    return prompt