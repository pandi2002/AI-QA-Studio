from fastapi import APIRouter
from pydantic import BaseModel
from fastapi.responses import FileResponse
from pathlib import Path

from services.automation_service import (
    cleanup_previous_execution,
    save_playwright_script,
    run_playwright,
    generate_allure_report,
    get_execution_summary,
)

router = APIRouter(prefix="/automation", tags=["Automation"])


class PlaywrightExecutionRequest(BaseModel):
    script: str


@router.post("/run")
async def run_generated_playwright(request: PlaywrightExecutionRequest):

    #Autodelete old folders
    cleanup_previous_execution()

    # Save generated Playwright script
    test_file = save_playwright_script(request.script)

    # Execute Playwright
    result = run_playwright(test_file)

    #Generate Allure report only after Playwright execution
    allure = generate_allure_report()
    if not allure["success"]:
        return {
        "success": False,
        "message": "Failed to generate Allure report.",
        "stdout": allure["stdout"],
        "stderr": allure["stderr"],
    }

    #Summary
    summary = get_execution_summary()

    return {
        "file": test_file.name,
        "success": result["success"],
        "stdout": result["stdout"],
        "stderr": result["stderr"],
        "summary": summary,
    }

@router.get("/report")
async def open_allure_report():

    report = (
        Path(__file__).parent.parent
        / "automation"
        / "allure-report"
        / "index.html"
    )

    if not report.exists():
        return {"error": "Allure report not found"}

    return FileResponse(report)