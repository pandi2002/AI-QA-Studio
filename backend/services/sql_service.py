from prompts.sql_prompt import build_sql_prompt

from services.ai_provider import get_provider

from services.ai_provider import parse_json


async def generate_sql(

    provider,
    requirement,
    testcase_data,

):

    prompt = build_sql_prompt(

        requirement=requirement,
        testcase_data=testcase_data,

    )

    service = get_provider(provider)

    result = await service.generate_response(prompt)

    return parse_json(result)