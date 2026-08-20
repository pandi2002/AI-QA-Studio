import json
from pathlib import Path
from typing import Optional, Any
from fastapi import APIRouter, HTTPException, Header # type: ignore
from pydantic import BaseModel # type: ignore

router = APIRouter(
    prefix="/user-data",
    tags=["User Workspace Data"]
)

USER_DATA_DIR = Path(__file__).parent.parent / "user_data"
USER_DATA_DIR.mkdir(parents=True, exist_ok=True)


def get_user_file(username: str) -> Path:
    safe_username = username.strip().lower()
    return USER_DATA_DIR / f"{safe_username}.json"


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
    file_path = get_user_file(username)

    payload = {
        "username": username,
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
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(payload, f, indent=2)
        return {"success": True, "message": "Workspace saved successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save workspace: {str(e)}")


@router.get("/load")
def load_user_workspace(x_username: Optional[str] = Header(None)):
    if not x_username:
        raise HTTPException(status_code=401, detail="Authentication required to load workspace.")

    username = x_username.strip().lower()
    file_path = get_user_file(username)

    if not file_path.exists():
        return {
            "success": True,
            "has_data": False,
            "data": None
        }

    try:
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        return {
            "success": True,
            "has_data": True,
            "data": data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load workspace: {str(e)}")


@router.post("/clear")
def clear_user_workspace(x_username: Optional[str] = Header(None)):
    if not x_username:
        raise HTTPException(status_code=401, detail="Authentication required to clear workspace.")

    username = x_username.strip().lower()
    file_path = get_user_file(username)

    if file_path.exists():
        file_path.unlink()

    return {"success": True, "message": "Workspace cleared."}
