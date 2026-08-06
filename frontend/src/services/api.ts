const API_URL = "http://127.0.0.1:8000";

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

export async function runAutomation(script: string) {

    const response = await fetch("http://127.0.0.1:8000/automation/run", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            script,
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

