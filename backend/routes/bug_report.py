from typing import Optional

from fastapi import APIRouter
from pydantic import BaseModel
from prompts.bug_prompt import generate_bug_report

router = APIRouter()


class BugReportRequest(BaseModel):
    provider: str
    requirement: Optional[str] = None
    testcases: Optional[dict] = None


@router.post("/generate-bug-report")
async def generate_bug_report_api(request: BugReportRequest):

    print(request.model_dump())

    result = await generate_bug_report(
        provider=request.provider,
        requirement=request.requirement,
        testcases=request.testcases
    )

    return {"result": result}