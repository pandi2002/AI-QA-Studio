from pathlib import Path
from datetime import datetime
import subprocess
import os
import re
import json
import shutil

# Directories
AUTOMATION_DIR = Path(__file__).parent.parent / "automation"
TESTS_DIR = AUTOMATION_DIR / "tests"

NPX_CMD = "npx.cmd" if os.name == "nt" else "npx"


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

    cmd = [NPX_CMD, "playwright", "test", f"tests/{test_file.name}"]

    result = subprocess.run(
        cmd,
        cwd=AUTOMATION_DIR,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        shell=(os.name == "nt"),
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

    cmd = [
        NPX_CMD,
        "allure",
        "generate",
        "allure-results",
        "--clean",
        "-o",
        "allure-report",
    ]

    result = subprocess.run(
        cmd,
        cwd=AUTOMATION_DIR,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        shell=(os.name == "nt"),
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

    stats = data.get("statistic", {})

    return {
        "total": stats.get("total", 0),
        "passed": stats.get("passed", 0),
        "failed": stats.get("failed", 0),
        "broken": stats.get("broken", 0),
        "skipped": stats.get("skipped", 0),
        "duration": round(data.get("time", {}).get("duration", 0) / 1000, 2),
    }


def run_local_automation(script: str):

    cleanup_previous_execution()

    file_path = save_playwright_script(script)

    pw_res = run_playwright(file_path)

    allure_res = generate_allure_report()

    summary = get_execution_summary()

    if summary is None:
        summary = {
            "total": pw_res["total"],
            "passed": pw_res["passed"],
            "failed": pw_res["failed"],
            "broken": 0,
            "skipped": 0,
            "duration": 0,
        }

    return {
        "success": pw_res["success"],
        "mode": "local",
        "message": "Automation completed locally.",
        "summary": summary,
        "stdout": pw_res["stdout"],
        "stderr": pw_res["stderr"] + ("\n" + allure_res["stderr"] if allure_res["stderr"] else ""),
    }