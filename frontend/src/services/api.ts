const API_URL = "https://ai-qa-studio.onrender.com";

import type { TestCaseResponse } from "../types/testcase";


export async function generateReview(result: any,
    provider: string) {

    const response = await fetch(
        `${API_URL}/generate-review`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ provider, testcase_data: result }),
        }
    );

    if (!response.ok) {
        throw new Error("Failed to generate AI Review.");
    }

    return await response.json();
}

export async function generateTestCases(
    requirement: string,
    testingTypes: string[],
    designTechniques: string[],
    images: File[],
    provider: string
) {

    const formData = new FormData();

    formData.append("requirement", requirement);

    formData.append(
        "testingTypes",
        JSON.stringify(testingTypes)
    );

    formData.append(
        "designTechniques",
        JSON.stringify(designTechniques)
    );
    formData.append("provider", provider);

    images.forEach((image) => {
        formData.append("images", image);
    });

    const response = await fetch(
        `${API_URL}/generate-testcases`,
        {
            method: "POST",
            body: formData,
        }
    );

    if (!response.ok) {
        const errorText = await response.text();

        console.error("Status:", response.status);
        console.error("Response:", errorText);

        throw new Error(
            `HTTP ${response.status}\n${errorText}`
        );
    }
    return await response.json();
}

export async function generatePlaywright(requirement: string,
    result: any,
    provider: string) {
    const response = await fetch(
        `${API_URL}/generate-playwright`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ provider, requirement, testcase_data: result, }),
        }
    );

    if (!response.ok) {
        throw new Error("Failed to generate Playwright.");
    }

    return await response.json();
}

export async function generateSQL(
    requirement: string,
    result: any,
    provider: string
) {

    const response = await fetch(
        `${API_URL}/generate-sql`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                provider,
                requirement,
                testcase_data: result,
            }),
        }
    );

    if (!response.ok) {
        throw new Error("Failed to generate SQL.");
    }

    return await response.json();
}

export async function loginUser(username: string, password: string) {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Login failed.");
    }
    return await response.json();
}

export async function registerUser(username: string, password: string, name?: string) {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, name }),
    });
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Registration failed.");
    }
    return await response.json();
}

export async function saveUserData(username: string, workspaceData: any) {

    if (!username || username === "default") return;
    try {
        await fetch(`${API_URL}/user-data/save`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Username": username,
            },
            body: JSON.stringify(workspaceData),
        });
    } catch (e) {
        console.error("Failed to auto-save user workspace:", e);
    }
}

export async function loadUserData(username: string) {
    if (!username || username === "default") return null;
    try {
        const res = await fetch(`${API_URL}/user-data/load`, {
            headers: {
                "X-Username": username,
            },
        });
        if (res.ok) {
            return await res.json();
        }
    } catch (e) {
        console.error("Failed to load user workspace:", e);
    }
    return null;
}

export async function clearUserData(username: string) {
    if (!username || username === "default") return;
    try {
        await fetch(`${API_URL}/user-data/clear`, {
            method: "POST",
            headers: {
                "X-Username": username,
            },
        });
    } catch (e) {
        console.error("Failed to clear user workspace:", e);
    }
}

export async function getUserHistoryList(username: string) {
    if (!username || username === "default") return { history: [] };
    const res = await fetch(`${API_URL}/user-data/history-list`, {
        headers: { "X-Username": username },
    });
    if (!res.ok) {
        throw new Error("Failed to fetch history list.");
    }
    return await res.json();
}

export async function loadUserHistoryItem(username: string, filename: string) {
    if (!username || username === "default") return null;
    const res = await fetch(`${API_URL}/user-data/history/${filename}`, {
        headers: { "X-Username": username },
    });
    if (!res.ok) {
        throw new Error("Failed to load history session.");
    }
    return await res.json();
}

export async function deleteUserHistoryItem(username: string, filename: string) {
    if (!username || username === "default") return;
    const res = await fetch(`${API_URL}/user-data/history/${filename}`, {
        method: "DELETE",
        headers: { "X-Username": username },
    });
    if (!res.ok) {
        throw new Error("Failed to delete history session.");
    }
    return await res.json();
}


export async function getAutomationStatus() {

    const response = await fetch(`${API_URL}/automation/status`);
    if (!response.ok) {
        throw new Error("Failed to fetch automation status.");
    }
    return await response.json();
}

export async function runAutomation(script: string, username: string = "default") {

    const response = await fetch(`${API_URL}/automation/run`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            script,
            username,
        }),
    });

    if (!response.ok) {
        throw new Error("Automation execution failed.");
    }

    return await response.json();
}


export async function generateBugReport(testcases: any,
    provider: string) {
    console.log({
        provider,
        testcases,
    });

    const response = await fetch(
        `${API_URL}/generate-bug-report`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                provider,
                testcases,
            }),
        }
    );

    if (!response.ok) {
        throw new Error("Failed to generate Bug Report.");
    }

    return await response.json();
}


export async function exportExcel(result: TestCaseResponse) {

    const response = await fetch(
        `${API_URL}/export-excel`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(result),
        }
    );

    if (!response.ok) {
        throw new Error("Failed to export Excel.");
    }

    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "Generated_TestCases.xlsx";

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);
}

export async function exportPdf(result: TestCaseResponse) {

    const response = await fetch(
        `${API_URL}/export-pdf`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(result),
        }
    );

    if (!response.ok) {
        throw new Error("Failed to export PDF.");
    }

    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "Generated_TestCases.pdf";

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);
}

