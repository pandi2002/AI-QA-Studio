import json
from datetime import datetime
from pathlib import Path
from typing import Optional, Any
from fastapi import APIRouter, HTTPException, Header # type: ignore
from pydantic import BaseModel # type: ignore

router = APIRouter(
    prefix="/user-data",
    tags=["User Workspace Data & History"]
)

USER_HISTORY_DIR = Path(__file__).parent.parent / "user_history"
USER_HISTORY_DIR.mkdir(parents=True, exist_ok=True)


def get_user_dir(username: str) -> Path:
    safe_username = username.strip().lower()
    user_dir = USER_HISTORY_DIR / safe_username
    user_dir.mkdir(parents=True, exist_ok=True)
    return user_dir


class SaveWorkspaceRequest(BaseModel):
    requirement: Optional[str] = ""
    testingTypes: Optional[list] = []
    designTechniques: Optional[list] = []
    testCases: Optional[Any] = None
    playwrightCode: Optional[str] = ""
    sqlCode: Optional[str] = ""
    review: Optional[Any] = None
    bugReport: Optional[Any] = None


@router.post("/save")
def save_user_workspace(
    data: SaveWorkspaceRequest,
    x_username: Optional[str] = Header(None)
):
    if not x_username:
        raise HTTPException(status_code=401, detail="Authentication required to save workspace.")

    username = x_username.strip().lower()
    user_dir = get_user_dir(username)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    formatted_date = datetime.now().strftime("%d %b %Y, %I:%M %p")

    test_case_count = 0
    if isinstance(data.testCases, dict):
        test_case_count = len(data.testCases.get("testCases", []))

    req_title = data.requirement.strip().split("\n")[0] if data.requirement else "Untitled Session"
    if len(req_title) > 40:
        req_title = req_title[:40] + "..."

    payload = {
        "filename": f"history_{timestamp}.json",
        "username": username,
        "timestamp": timestamp,
        "formattedDate": formatted_date,
        "requirementTitle": req_title or "Untitled Session",
        "testCaseCount": test_case_count,
        "requirement": data.requirement,
        "testingTypes": data.testingTypes,
        "designTechniques": data.designTechniques,
        "testCases": data.testCases,
        "playwrightCode": data.playwrightCode,
        "sqlCode": data.sqlCode,
        "review": data.review,
        "bugReport": data.bugReport,
    }

    try:
        # Save current active session
        current_file = user_dir / "current.json"
        with open(current_file, "w", encoding="utf-8") as f:
            json.dump(payload, f, indent=2)

        # Save timestamped history entry if testCases or requirement exists
        if data.testCases or data.requirement or data.playwrightCode:
            history_file = user_dir / f"history_{timestamp}.json"
            with open(history_file, "w", encoding="utf-8") as f:
                json.dump(payload, f, indent=2)

        return {"success": True, "message": "Workspace saved to history successfully.", "filename": f"history_{timestamp}.json"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save workspace: {str(e)}")


@router.get("/load")
def load_user_workspace(x_username: Optional[str] = Header(None)):
    if not x_username:
        raise HTTPException(status_code=401, detail="Authentication required to load workspace.")

    username = x_username.strip().lower()
    user_dir = get_user_dir(username)
    current_file = user_dir / "current.json"

    if not current_file.exists():
        return {
            "success": True,
            "has_data": False,
            "data": None
        }

    try:
        with open(current_file, "r", encoding="utf-8") as f:
            data = json.load(f)
        return {
            "success": True,
            "has_data": True,
            "data": data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load workspace: {str(e)}")


@router.get("/history-list")
def get_user_history_list(x_username: Optional[str] = Header(None)):
    if not x_username:
        raise HTTPException(status_code=401, detail="Authentication required to view history.")

    username = x_username.strip().lower()
    user_dir = get_user_dir(username)

    history_items = []
    for file_path in sorted(user_dir.glob("history_*.json"), reverse=True):
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                history_items.append({
                    "filename": file_path.name,
                    "formattedDate": data.get("formattedDate", "Unknown Date"),
                    "requirementTitle": data.get("requirementTitle", "Untitled Session"),
                    "testCaseCount": data.get("testCaseCount", 0),
                    "hasPlaywright": bool(data.get("playwrightCode")),
                    "hasSQL": bool(data.get("sqlCode")),
                    "hasBugReport": bool(data.get("bugReport")),
                })
        except Exception:
            continue

    return {
        "success": True,
        "history": history_items
    }


@router.get("/history/{filename}")
def load_history_item(filename: str, x_username: Optional[str] = Header(None)):
    if not x_username:
        raise HTTPException(status_code=401, detail="Authentication required.")

    username = x_username.strip().lower()
    user_dir = get_user_dir(username)
    file_path = user_dir / filename

    if not file_path.exists():
        raise HTTPException(status_code=404, detail="History session not found.")

    try:
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        # Also update current.json
        current_file = user_dir / "current.json"
        with open(current_file, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)

        return {"success": True, "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load history item: {str(e)}")


@router.delete("/history/{filename}")
def delete_history_item(filename: str, x_username: Optional[str] = Header(None)):
    if not x_username:
        raise HTTPException(status_code=401, detail="Authentication required.")

    username = x_username.strip().lower()
    user_dir = get_user_dir(username)
    file_path = user_dir / filename

    if file_path.exists():
        file_path.unlink()

    return {"success": True, "message": "History entry deleted."}


@router.post("/clear")
def clear_user_workspace(x_username: Optional[str] = Header(None)):
    if not x_username:
        raise HTTPException(status_code=401, detail="Authentication required to clear workspace.")

    username = x_username.strip().lower()
    user_dir = get_user_dir(username)

    current_file = user_dir / "current.json"
    if current_file.exists():
        current_file.unlink()

    return {"success": True, "message": "Active workspace cleared."}
