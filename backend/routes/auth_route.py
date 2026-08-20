import os
import json
import hashlib
from pathlib import Path
from typing import Optional
from fastapi import APIRouter, HTTPException, Header # type: ignore
from pydantic import BaseModel # type: ignore

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

USERS_FILE = Path(__file__).parent.parent / "users.json"


def load_users() -> dict:
    if not USERS_FILE.exists():
        return {}
    try:
        with open(USERS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return {}


def save_users(users: dict):
    with open(USERS_FILE, "w", encoding="utf-8") as f:
        json.dump(users, f, indent=2)


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


class RegisterRequest(BaseModel):
    username: str
    password: str
    name: Optional[str] = None


class LoginRequest(BaseModel):
    username: str
    password: str


@router.post("/register")
def register_user(req: RegisterRequest):
    username = req.username.strip().lower()
    if not username or len(username) < 3:
        raise HTTPException(status_code=400, detail="Username must be at least 3 characters long.")
    if not req.password or len(req.password) < 4:
        raise HTTPException(status_code=400, detail="Password must be at least 4 characters long.")

    users = load_users()
    if username in users:
        # If account already exists and password matches, sign in directly!
        if users[username]["password"] == hash_password(req.password):
            return {
                "success": True,
                "message": "Welcome back!",
                "user": {
                    "username": username,
                    "name": users[username]["name"],
                }
            }
        else:
            raise HTTPException(status_code=400, detail="Username already exists with a different password.")

    users[username] = {
        "username": username,
        "password": hash_password(req.password),
        "name": req.name or username.capitalize(),
    }
    save_users(users)

    return {
        "success": True,
        "message": "Registration successful!",
        "user": {
            "username": username,
            "name": users[username]["name"],
        }
    }



@router.post("/login")
def login_user(req: LoginRequest):
    username = req.username.strip().lower()
    if not username or len(username) < 3:
        raise HTTPException(status_code=400, detail="Username must be at least 3 characters long.")
    if not req.password or len(req.password) < 4:
        raise HTTPException(status_code=400, detail="Password must be at least 4 characters long.")

    users = load_users()

    # If user not found, auto-create account and sign in seamlessly
    if username not in users:
        users[username] = {
            "username": username,
            "password": hash_password(req.password),
            "name": username.capitalize(),
        }
        save_users(users)
        return {
            "success": True,
            "message": "Welcome! Account created and logged in.",
            "user": {
                "username": username,
                "name": users[username]["name"],
            }
        }

    user = users[username]
    if user["password"] != hash_password(req.password):
        raise HTTPException(status_code=400, detail="Incorrect password. Please enter the correct password.")

    return {
        "success": True,
        "message": "Login successful!",
        "user": {
            "username": username,
            "name": user["name"],
        }
    }



@router.get("/me")
def get_current_user(x_username: Optional[str] = Header(None)):
    if not x_username:
        return {"logged_in": False, "user": None}
    
    users = load_users()
    user = users.get(x_username.strip().lower())
    if not user:
        return {"logged_in": False, "user": None}

    return {
        "logged_in": True,
        "user": {
            "username": user["username"],
            "name": user["name"],
        }
    }
