export const SUCCESS_MESSAGES = {
    TEST_CASES: "Test Cases generated successfully!",
    PLAYWRIGHT: "Playwright generated successfully!",
    SQL: "SQL generated successfully!",
    REVIEW: "AI Review generated successfully!",
    BUG_REPORT: "Bug Report generated successfully!",
    AUTOMATION: "Automation executed successfully!",
    EXCEL_EXPORT: "Excel exported successfully!",
    PDF_EXPORT: "PDF exported successfully!",
    COPY_TESTCASES: "Test Cases copied successfully!",
    COPY_JSON: "JSON copied successfully!"
};

export const ERROR_MESSAGES = {
    TEST_CASES: "Failed to generate Test Cases.",
    PLAYWRIGHT: "Failed to generate Playwright.",
    SQL: "Failed to generate SQL.",
    REVIEW: "Failed to generate AI Review.",
    BUG_REPORT: "Failed to generate Bug Report.",
    AUTOMATION: "Failed to execute automation.",
    EXCEL_EXPORT: "Failed to export Excel.",
    PDF_EXPORT: "Failed to export PDF.",
    COPY: "Nothing available to copy."
};

export const VALIDATION_MESSAGES = {
    REQUIREMENT:
        "Please enter a requirement or upload at least one UI screenshot.",

    TESTING_TYPE:
        "Please select at least one Testing Type.",

    PLAYWRIGHT_REQUIRED:
        "Please generate Playwright code first.",

    TESTCASE_REQUIRED:
        "Please generate test cases first.",

    BUGREPORT_REQUIRED:
        "Please enter a requirement or generate test cases first."
};

export const LOADING_MESSAGES = {
    TEST_CASES: "⏳ Generating Test Cases...",
    PLAYWRIGHT: "⏳ Generating Playwright...",
    SQL: "⏳ Generating SQL...",
    REVIEW: "⏳ Generating AI Review...",
    BUG_REPORT: "⏳ Generating Bug Report...",
    AUTOMATION: "⏳ Running Playwright Automation..."
};