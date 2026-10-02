import type { TestCaseResponse } from "../types/testcase";

interface Props {
    result: TestCaseResponse | null;
}

export default function Results({ result }: Props) {
    if (!result || !result.testCases || !Array.isArray(result.testCases) || result.testCases.length === 0) {
        return null;
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">
                        📋 {result.module || "Test Suite"}
                    </h2>
                    <p className="mt-2 text-slate-500">
                        AI generated
                        <span className="font-semibold text-blue-600">
                            {" "} {result.testCases.length}{" "}
                        </span>
                        test cases
                    </p>
                </div>
                <div className="bg-blue-100 text-blue-700 px-5 py-3 rounded-xl font-semibold">
                    {result.testCases.length} Cases
                </div>
            </div>

            <div className="mt-8 space-y-8">
                {result.testCases.map((testCase: any, index: number) => {
                    if (!testCase || typeof testCase !== "object") return null;

                    const tcId = testCase.testCaseId || testCase.id || `TC-${index + 1}`;
                    const category = testCase.category || testCase.type || "Functional";
                    const priority = testCase.priority || "Medium";
                    const scenario = typeof testCase.scenario === "string" 
                        ? testCase.scenario 
                        : (testCase.scenario ? JSON.stringify(testCase.scenario) : "N/A");

                    const preconditions: string[] = Array.isArray(testCase.preconditions)
                        ? testCase.preconditions.map((p: any) => String(p))
                        : typeof testCase.preconditions === "string"
                        ? [testCase.preconditions]
                        : [];

                    const steps: any[] = Array.isArray(testCase.steps)
                        ? testCase.steps
                        : typeof testCase.steps === "string"
                        ? [{ action: testCase.steps, expectedResult: "" }]
                        : [];

                    const renderTestData = (data: any) => {
                        if (!data) return "N/A";
                        if (typeof data === "string") return data;
                        if (typeof data === "object") {
                            try {
                                return Object.entries(data)
                                    .map(([k, v]) => `${k}: ${typeof v === "object" ? JSON.stringify(v) : String(v)}`)
                                    .join(", ");
                            } catch {
                                return JSON.stringify(data);
                            }
                        }
                        return String(data);
                    };

                    const designTechnique = typeof testCase.designTechnique === "string"
                        ? testCase.designTechnique
                        : (testCase.designTechnique ? JSON.stringify(testCase.designTechnique) : "Standard");

                    return (
                        <div
                            key={tcId + "-" + index}
                            className="
                                rounded-2xl
                                border
                                border-slate-200
                                bg-slate-50
                                p-6
                                shadow-sm
                                hover:shadow-lg
                                transition-all
                                duration-300
                            "
                        >
                            {/* Test Case Header */}
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                                            {index + 1}
                                        </span>
                                        <h3 className="text-xl font-bold text-slate-800">
                                            {tcId}
                                        </h3>
                                    </div>
                                    <p className="mt-2 text-slate-500">
                                        {category}
                                    </p>
                                </div>

                                <span
                                    className={`
                                        px-4
                                        py-2
                                        rounded-full
                                        text-sm
                                        font-semibold
                                        ${priority === "High"
                                            ? "bg-red-100 text-red-700"
                                            : priority === "Medium"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-green-100 text-green-700"
                                        }
                                    `}
                                >
                                    {priority}
                                </span>
                            </div>

                            {/* Scenario */}
                            <div className="mt-6">
                                <h4 className="font-bold text-slate-800 mb-2">
                                    🎯 Scenario
                                </h4>
                                <p className="text-slate-700">
                                    {scenario}
                                </p>
                            </div>

                            {/* Preconditions */}
                            {preconditions.length > 0 && (
                                <div className="mt-6">
                                    <h4 className="font-bold text-slate-800 mb-2">
                                        📌 Preconditions
                                    </h4>
                                    <ul className="space-y-2">
                                        {preconditions.map((item, itemIdx) => (
                                            <li
                                                key={itemIdx}
                                                className="bg-white rounded-lg p-3 border text-slate-700"
                                            >
                                                ✅ {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Steps */}
                            {steps.length > 0 && (
                                <div className="mt-6">
                                    <h4 className="font-bold text-slate-800 mb-3">
                                        🚀 Test Steps
                                    </h4>
                                    <div className="space-y-4">
                                        {steps.map((stepItem: any, stepIndex: number) => {
                                            const actionText = typeof stepItem === "object" && stepItem !== null
                                                ? (stepItem.action || stepItem.step || JSON.stringify(stepItem))
                                                : String(stepItem || "");
                                            const expectedText = typeof stepItem === "object" && stepItem !== null
                                                ? (stepItem.expectedResult || stepItem.expected_result || stepItem.expected || "")
                                                : "";

                                            return (
                                                <div
                                                    key={stepIndex}
                                                    className="bg-white rounded-xl border p-4 shadow-sm"
                                                >
                                                    <div className="font-semibold text-blue-700">
                                                        Step {stepIndex + 1}
                                                    </div>
                                                    <p className="mt-2 text-slate-800 font-medium">
                                                        {actionText}
                                                    </p>
                                                    {expectedText && (
                                                        <div className="mt-3 bg-green-50 border-l-4 border-green-500 p-3 rounded">
                                                            <span className="font-semibold text-green-800 text-sm">
                                                                Expected Result
                                                            </span>
                                                            <p className="mt-1 text-green-700">
                                                                {expectedText}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Test Data */}
                            <div className="mt-6">
                                <h4 className="font-bold text-slate-800 mb-2">
                                    🗂 Test Data
                                </h4>
                                <div className="bg-white rounded-xl border p-4 text-slate-700 font-mono text-sm">
                                    {renderTestData(testCase.testData)}
                                </div>
                            </div>

                            {/* Design Technique */}
                            <div className="mt-6">
                                <h4 className="font-bold text-slate-800 mb-2">
                                    🧠 Design Technique
                                </h4>
                                <span className="inline-block bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold">
                                    {designTechnique}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}