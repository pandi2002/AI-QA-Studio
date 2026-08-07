from pathlib import Path
from datetime import datetime
import subprocess
import re
import json
import shutil

# Directories
AUTOMATION_DIR = Path(__file__).parent.parent / "automation"
TESTS_DIR = AUTOMATION_DIR / "tests"

# # Local executables
# PLAYWRIGHT_CMD = AUTOMATION_DIR / "node_modules" / ".bin" / "playwright.cmd"
# ALLURE_CMD = AUTOMATION_DIR / "node_modules" / ".bin" / "allure.cmd"


def cleanup_previous_execution():

    # Delete report folders
    folders = [
        AUTOMATION_DIR / "allure-results",
        AUTOMATION_DIR / "allure-report",
        AUTOMATION_DIR / "playwright-report",
        AUTOMATION_DIR / "test-results",
    ]
    for folder in folders:

        if not folder.exists():
            folder.mkdir(parents=True, exist_ok=True)
            continue

        for item in folder.iterdir():

            if item.is_dir():
                shutil.rmtree(item)

            else:
                item.unlink()


    # Delete previously generated Playwright scripts
    if TESTS_DIR.exists():
        for file in TESTS_DIR.glob("generated_*.spec.ts"):
            file.unlink()

def save_playwright_script(script: str) -> Path:
    TESTS_DIR.mkdir(parents=True, exist_ok=True)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    file_name = f"generated_{timestamp}.spec.ts"

    file_path = TESTS_DIR / file_name
    file_path.write_text(script, encoding="utf-8")

    return file_path


def run_playwright(test_file: Path):

    result = subprocess.run(
        [
            "npx",
            str(PLAYWRIGHT_CMD),
            "test",
            f"tests/{test_file.name}",
        ],
        cwd=AUTOMATION_DIR,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
    )

    stdout = result.stdout

    passed = len(re.findall(r"✓", stdout))
    failed = len(re.findall(r"✘", stdout))

    total = passed + failed

    return {
        "success": result.returncode == 0,
        "total": total,
        "passed": passed,
        "failed": failed,
        "stdout": stdout,
        "stderr": result.stderr,
    }

def generate_allure_report():

    result = subprocess.run(
        [
            "npx",
            str(ALLURE_CMD),
            "generate",
            "allure-results",
            "--clean",
            "-o",
            "allure-report",
        ],
        cwd=AUTOMATION_DIR,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
    )

    return {
        "success": result.returncode == 0,
        "stdout": result.stdout,
        "stderr": result.stderr,
    }

def get_execution_summary():

    summary_file = (
        AUTOMATION_DIR
        / "allure-report"
        / "widgets"
        / "summary.json"
    )

    if not summary_file.exists():
        return None

    with open(summary_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    stats = data["statistic"]

    return {
        "total": stats["total"],
        "passed": stats["passed"],
        "failed": stats["failed"],
        "broken": stats["broken"],
        "skipped": stats["skipped"],
        "duration": round(data["time"]["duration"] / 1000, 2),
    }