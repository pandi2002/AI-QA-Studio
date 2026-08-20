from fastapi import APIRouter # type: ignore
from pydantic import BaseModel # type: ignore

from services.github_service import (
    upload_playwright_script,
    trigger_github_action,
)

router = APIRouter(
    prefix="/automation",
    tags=["Automation"]
)


class PlaywrightExecutionRequest(BaseModel):
    script: str


@router.post("/run")
async def run_generated_playwright(
    request: PlaywrightExecutionRequest
):

    try:

        # Upload the EXACT generated Playwright script to GitHub
        upload_result = upload_playwright_script(
            request.script
        )

        # Trigger GitHub Actions
        workflow_result = trigger_github_action()

        return {
            "success": True,
            "message": "Automation started successfully.",
            "file": "generated.spec.ts",
            "github": workflow_result,
            "commit": upload_result.get("commit", {}).get("sha"),
        }

    except Exception as e:

        return {
            "success": False,
            "message": str(e),
        }