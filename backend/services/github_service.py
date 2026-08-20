import os
import base64
import requests # type: ignore


GITHUB_API = "https://api.github.com"

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
GITHUB_OWNER = os.getenv("GITHUB_OWNER", "pandi2002")
GITHUB_REPO = os.getenv("GITHUB_REPO", "AI-QA-Studio")
GITHUB_BRANCH = os.getenv("GITHUB_BRANCH", "main")

WORKFLOW_FILE = "automation.yml"

# This is the file GitHub Actions will execute.
PLAYWRIGHT_FILE_PATH = (
    "backend/automation/tests/generated.spec.ts"
)


def get_headers():

    if not GITHUB_TOKEN:
        raise Exception(
            "GITHUB_TOKEN environment variable is not configured."
        )

    return {
        "Authorization": f"Bearer {GITHUB_TOKEN}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "application/json",
    }


def upload_playwright_script(script: str):

    url = (
        f"{GITHUB_API}/repos/"
        f"{GITHUB_OWNER}/"
        f"{GITHUB_REPO}/contents/"
        f"{PLAYWRIGHT_FILE_PATH}"
    )

    # Check whether the file already exists.
    existing = requests.get(
        url,
        headers=get_headers(),
        params={"ref": GITHUB_BRANCH},
        timeout=30,
    )

    sha = None

    if existing.status_code == 200:
        sha = existing.json().get("sha")

    elif existing.status_code != 404:
        raise Exception(
            f"Unable to check existing Playwright file: "
            f"{existing.status_code} {existing.text}"
        )

    encoded_script = base64.b64encode(
        script.encode("utf-8")
    ).decode("utf-8")

    payload = {
        "message": "Update generated Playwright test",
        "content": encoded_script,
        "branch": GITHUB_BRANCH,
    }

    # GitHub requires SHA when updating an existing file.
    if sha:
        payload["sha"] = sha

    response = requests.put(
        url,
        headers=get_headers(),
        json=payload,
        timeout=30,
    )

    if response.status_code not in (200, 201):
        raise Exception(
            f"Failed to upload Playwright script: "
            f"{response.status_code} {response.text}"
        )

    return response.json()


def trigger_github_action():

    url = (
        f"{GITHUB_API}/repos/"
        f"{GITHUB_OWNER}/"
        f"{GITHUB_REPO}/actions/workflows/"
        f"{WORKFLOW_FILE}/dispatches"
    )

    payload = {
        "ref": GITHUB_BRANCH
    }

    response = requests.post(
        url,
        headers=get_headers(),
        json=payload,
        timeout=30,
    )

    if response.status_code != 204:
        raise Exception(
            f"Failed to trigger GitHub Actions: "
            f"{response.status_code} {response.text}"
        )

    return {
        "success": True,
        "workflow": WORKFLOW_FILE,
        "branch": GITHUB_BRANCH,
        "message": "GitHub Actions workflow triggered successfully.",
    }