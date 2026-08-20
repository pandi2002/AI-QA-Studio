import os
from fastapi import APIRouter  # type: ignore
from pydantic import BaseModel  # type: ignore

from services.github_service import (
    upload_playwright_script,
    trigger_github_action,
    get_actions_url,
    get_report_url,
    get_github_token,
)
from services.automation_service import run_local_automation

router = APIRouter(
    prefix="/automation",
    tags=["Automation"]
)


class PlaywrightExecutionRequest(BaseModel):
    script: str
    mode: str = "auto"  # "auto", "github", or "local"


@router.post("/run")
async def run_generated_playwright(
    request: PlaywrightExecutionRequest
):
    token = get_github_token()

    
    # Try GitHub Actions if token exists or explicitly requested
    if token or request.mode == "github":
        try:
            # Upload the Playwright script to GitHub repository
            upload_result = upload_playwright_script(request.script)

            # Trigger GitHub Actions workflow
            workflow_result = trigger_github_action()

            return {
                "success": True,
                "mode": "github",
                "message": "Automation triggered successfully on GitHub Actions! Check execution logs and Allure report below.",
                "file": "generated.spec.ts",
                "actions_url": get_actions_url(),
                "report_url": get_report_url(),
                "commit": upload_result.get("commit", {}).get("sha"),
                "github": workflow_result,
            }
        except Exception as github_err:
            return {
                "success": False,
                "mode": "github",
                "message": f"GitHub Actions trigger failed: {str(github_err)}",
                "actions_url": get_actions_url(),
                "report_url": get_report_url(),
            }

    # If running locally or token not configured yet, attempt local execution
    try:
        res = run_local_automation(request.script)
        res["report_url"] = "/allure-report/index.html"
        if not res.get("success") and "Local Playwright execution exception" in res.get("stderr", ""):
            res["message"] = "GITHUB_TOKEN is not configured on Render. Please add GITHUB_TOKEN under Render Environment Variables to enable GitHub Actions automation."
        return res
    except Exception as e:
        return {
            "success": False,
            "mode": "local",
            "message": f"Automation execution failed: {str(e)}",
            "stdout": "",
            "stderr": str(e),
        }
