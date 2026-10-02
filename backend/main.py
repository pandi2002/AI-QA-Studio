import json
import traceback
from fastapi.staticfiles import StaticFiles

from fastapi import (
    FastAPI,
    Form,
    File,
    UploadFile,
    Body,
)
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
)

from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.enums import TA_CENTER 
from reportlab.lib.colors import HexColor 

from datetime import datetime

from routes.automation_route import router as automation_router
from routes.auth_route import router as auth_router
from routes.user_data_route import router as user_data_router



from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from routes.bug_report import router as bug_report_router
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill

from services.sql_service import generate_sql
from services.ai_provider import (
    generate_testcases,
    generate_playwright,
    generate_review,
)

app = FastAPI(
    title="AI QA Studio",
    version="2.0"
)
from pathlib import Path
from fastapi.responses import RedirectResponse

ALLURE_REPORT_DIR = Path(__file__).parent / "automation" / "allure-report"

# Create the directory if it doesn't exist
ALLURE_REPORT_DIR.mkdir(parents=True, exist_ok=True)

@app.get("/allure-report-url")
def get_allure_report_url():
    index_path = ALLURE_REPORT_DIR / "index.html"
    if index_path.exists() and index_path.stat().st_size > 0:
        return {"url": "/allure-report/index.html", "is_local": True}
    return {"url": "https://pandi2002.github.io/AI-QA-Studio/", "is_local": False}

app.mount(
    "/allure-report",
    StaticFiles(directory=ALLURE_REPORT_DIR),
    name="allure-report",
)

app.include_router(bug_report_router)
app.include_router(automation_router)
app.include_router(auth_router)
app.include_router(user_data_router)




app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "AI QA Studio Backend Running"
    }


# ======================================================
# Generate Test Cases
# ======================================================

@app.post("/generate-testcases")
async def generate_testcases_api(

    requirement: str = Form(""),

    testingTypes: str = Form("[]"),

    designTechniques: str = Form("[]"),

    outputOptions: str = Form("[]"),

    provider: str = Form("gemini"),

    images: list[UploadFile] = File(default=[]),

):

    try:

        testing_types = json.loads(testingTypes)

        design_techniques = json.loads(designTechniques)

        output_options = json.loads(outputOptions)

        result = await generate_testcases(

            provider=provider,

            requirement=requirement,

            testing_types=testing_types,

            design_techniques=design_techniques,

            images=images,

        )

        return {
            "result": result
        }

    except Exception as e:
        traceback.print_exc()   # Prints the full error in the terminal

        return {
            "result": str(e)    # Sends the error back to the frontend
        }


# ======================================================
# Generate Playwright
# ======================================================

@app.post("/generate-playwright")
async def generate_playwright_api(data: dict = Body(...)):

    try:

        result = await generate_playwright(provider=data["provider"],requirement=data["requirement"],testcase_data=data["testcase_data"],)

        return {
            "result": result
        }

    except Exception as e:

        traceback.print_exc()

        return {
            "result": str(e)
        }


# ======================================================
# Export Excel
# ======================================================

@app.post("/export-excel")
def export_excel(data: dict = Body(...)):

    wb = Workbook()
    ws = wb.active
    ws.title = "Test Cases"

    headers = [
        "Test Case ID",
        "Category",
        "Priority",
        "Scenario",
        "Preconditions",
        "Steps",
        "Test Data",
        "Design Technique",
    ]

    fill = PatternFill(
        start_color="4F81BD",
        end_color="4F81BD",
        fill_type="solid",
    )

    font = Font(
        bold=True,
        color="FFFFFF",
    )

    # Header row
    for col, header in enumerate(headers, start=1):
        cell = ws.cell(row=1, column=col)
        cell.value = header
        cell.fill = fill
        cell.font = font

    # Data rows
    row = 2

    test_cases = data.get("testCases", [])
    if not isinstance(test_cases, list):
        test_cases = []

    for tc in test_cases:
        if not isinstance(tc, dict):
            continue

        tc_id = tc.get("testCaseId") or tc.get("test_case_id") or tc.get("id") or f"TC-{row-1}"
        cat = tc.get("category") or tc.get("test_type") or "Functional"
        prio = tc.get("priority") or "Medium"
        scen = tc.get("scenario") or tc.get("test_scenario") or tc.get("description") or ""

        pre = tc.get("preconditions") or tc.get("pre_conditions") or []
        pre_str = "\n".join(pre) if isinstance(pre, list) else str(pre)

        raw_steps = tc.get("steps") or tc.get("test_steps") or []
        formatted_steps = []
        if isinstance(raw_steps, list):
            for index, step in enumerate(raw_steps, start=1):
                if isinstance(step, dict):
                    act = step.get("action") or step.get("step") or ""
                    exp = step.get("expectedResult") or step.get("expected_result") or ""
                    if exp:
                        formatted_steps.append(f"Step {index}: {act}\nExpected: {exp}")
                    else:
                        formatted_steps.append(f"Step {index}: {act}")
                else:
                    formatted_steps.append(f"Step {index}: {step}")
        else:
            formatted_steps.append(str(raw_steps))

        t_data = tc.get("testData") or tc.get("test_data") or ""
        if isinstance(t_data, dict):
            t_data = ", ".join(f"{k}: {v}" for k, v in t_data.items())

        dt = tc.get("designTechnique") or tc.get("design_technique") or "Standard"

        ws.cell(row=row, column=1).value = tc_id
        ws.cell(row=row, column=2).value = cat
        ws.cell(row=row, column=3).value = prio
        ws.cell(row=row, column=4).value = scen
        ws.cell(row=row, column=5).value = pre_str
        ws.cell(row=row, column=6).value = "\n\n".join(formatted_steps)
        ws.cell(row=row, column=7).value = str(t_data)
        ws.cell(row=row, column=8).value = str(dt)

        row += 1

    # Auto-size columns
    for column_cells in ws.columns:
        length = max(
            len(str(cell.value)) if cell.value else 0
            for cell in column_cells
        )
        ws.column_dimensions[column_cells[0].column_letter].width = min(length + 5, 50)

    EXPORT_DIR = Path(__file__).parent / "exports"
    EXPORT_DIR.mkdir(exist_ok=True)

    file_path = EXPORT_DIR / "Generated_TestCases.xlsx"

    wb.save(file_path)
    return FileResponse(
        path=file_path,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        filename="Generated_TestCases.xlsx",
    )

# ======================================================
# Export PDF
# ======================================================

@app.post("/export-pdf")
def export_pdf(data: dict = Body(...)):

    EXPORT_DIR = Path(__file__).parent / "exports"
    EXPORT_DIR.mkdir(exist_ok=True)

    file_path = EXPORT_DIR / "Generated_TestCases.pdf"

    doc = SimpleDocTemplate(str(file_path))

    styles = getSampleStyleSheet()

    story = []

    # Title
    title = styles["Title"]
    title.alignment = TA_CENTER
    title.textColor = HexColor("#1F4E79")

    story.append(Paragraph("AI QA Studio", title))
    story.append(Paragraph("<b>Generated Test Cases Report</b>", styles["Heading2"]))
    story.append(Paragraph(f"Generated On : {datetime.now().strftime('%d-%m-%Y %I:%M %p')}", styles["Normal"]))
    story.append(Spacer(1, 20))

    test_cases = data.get("testCases", [])
    if not isinstance(test_cases, list):
        test_cases = []

    for index, tc in enumerate(test_cases, start=1):
        if not isinstance(tc, dict):
            continue

        tc_id = tc.get("testCaseId") or tc.get("test_case_id") or tc.get("id") or f"TC-{index}"
        cat = tc.get("category") or tc.get("test_type") or "Functional"
        prio = tc.get("priority") or "Medium"
        scen = tc.get("scenario") or tc.get("test_scenario") or tc.get("description") or ""

        story.append(Paragraph(f"<b>{tc_id}</b>", styles["Heading2"]))
        story.append(Paragraph(f"<b>Category:</b> {cat} | <b>Priority:</b> {prio}", styles["BodyText"]))
        story.append(Spacer(1, 6))

        story.append(Paragraph("<b>Scenario</b>", styles["Heading3"]))
        story.append(Paragraph(scen, styles["BodyText"]))
        story.append(Spacer(1, 6))

        # Preconditions
        pre = tc.get("preconditions") or tc.get("pre_conditions") or []
        if pre:
            story.append(Paragraph("<b>Preconditions</b>", styles["Heading3"]))
            if isinstance(pre, list):
                for p_idx, p_item in enumerate(pre, start=1):
                    story.append(Paragraph(f"• {p_item}", styles["BodyText"]))
            else:
                story.append(Paragraph(str(pre), styles["BodyText"]))
            story.append(Spacer(1, 6))

        # Steps
        raw_steps = tc.get("steps") or tc.get("test_steps") or []
        if raw_steps:
            story.append(Paragraph("<b>Execution Steps</b>", styles["Heading3"]))
            if isinstance(raw_steps, list):
                for s_idx, step in enumerate(raw_steps, start=1):
                    if isinstance(step, dict):
                        act = step.get("action") or step.get("step") or ""
                        exp = step.get("expectedResult") or step.get("expected_result") or ""
                        story.append(Paragraph(f"<b>Step {s_idx}:</b> {act}", styles["BodyText"]))
                        if exp:
                            story.append(Paragraph(f"<i>Expected:</i> {exp}", styles["BodyText"]))
                    else:
                        story.append(Paragraph(f"Step {s_idx}: {step}", styles["BodyText"]))
            else:
                story.append(Paragraph(str(raw_steps), styles["BodyText"]))
            story.append(Spacer(1, 6))

        # Test Data
        t_data = tc.get("testData") or tc.get("test_data") or ""
        if t_data:
            if isinstance(t_data, dict):
                t_data = ", ".join(f"{k}: {v}" for k, v in t_data.items())
            story.append(Paragraph("<b>Test Data</b>", styles["Heading3"]))
            story.append(Paragraph(str(t_data), styles["BodyText"]))
            story.append(Spacer(1, 6))

        # Design Technique
        dt = tc.get("designTechnique") or tc.get("design_technique") or "Standard"
        story.append(Paragraph(f"<b>Design Technique:</b> {dt}", styles["BodyText"]))
        story.append(Spacer(1, 20))

    doc.build(story)

    return FileResponse(
        path=file_path,
        media_type="application/pdf",
        filename="Generated_TestCases.pdf",
    )


# ======================================================
# AI Review
# ======================================================

@app.post("/generate-review")
async def generate_review_api(data: dict = Body(...)):

    try:

        result = await generate_review(provider=data["provider"],

            testcase_data=data["testcase_data"],)

        return {
            "result": result
        }

    except Exception:

        traceback.print_exc()

        return {
            "result": "Failed to generate AI Review."
        }

# ======================================================
# SQL Generator
# ======================================================

@app.post("/generate-sql")
async def generate_sql_api(data: dict = Body(...)):

    try:

        result = await generate_sql(
            provider=data["provider"],
            requirement=data["requirement"],
            testcase_data=data.get("testcase_data"),
        )

        return {
            "result": result
        }

    except Exception as e:

        traceback.print_exc()

        return {
            "result": str(e)
        }