import type { TestCaseResponse } from "../types/testcase";

interface Props {
    result: TestCaseResponse | null;
}

export default function Results({ result }: Props) {

    if (!result || !result.testCases?.length) {
        return null;
    }

    return (

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">

            {/* Header */}

            <div className="flex items-center justify-between">

                <div>

                    <h2 className="text-3xl font-bold text-slate-800">
                        📋 {result.module}
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

                {result.testCases.map((testCase, index) => (

                    <div

                        key={testCase.testCaseId}

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

                                        {testCase.testCaseId}

                                    </h3>

                                </div>

                                <p className="mt-2 text-slate-500">

                                    {testCase.category}

                                </p>

                            </div>

                            <span

                                className={`
                                    px-4
                                    py-2
                                    rounded-full
                                    text-sm
                                    font-semibold

                                    ${testCase.priority === "High"

                                        ? "bg-red-100 text-red-700"

                                        : testCase.priority === "Medium"

                                            ? "bg-yellow-100 text-yellow-700"

                                            : "bg-green-100 text-green-700"
                                    }

                                `}

                            >

                                {testCase.priority}

                            </span>

                        </div>

                        {/* Scenario */}

                        <div className="mt-6">

                            <h4 className="font-bold text-slate-800 mb-2">

                                🎯 Scenario

                            </h4>

                            <p className="text-slate-700">

                                {testCase.scenario}

                            </p>

                        </div>

                        {/* Preconditions */}

                        <div className="mt-6">

                            <h4 className="font-bold text-slate-800 mb-2">

                                📌 Preconditions

                            </h4>

                            <ul className="space-y-2">

                                {testCase.preconditions.map((item, index) => (

                                    <li
                                        key={index}
                                        className="bg-white rounded-lg p-3 border"
                                    >

                                        ✅ {item}

                                    </li>

                                ))}

                            </ul>

                        </div>

                        {/* Steps */}

                        <div className="mt-6">

                            <h4 className="font-bold text-slate-800 mb-3">

                                🚀 Test Steps

                            </h4>

                            <div className="space-y-4">

                                {testCase.steps.map((step, index) => (

                                    <div

                                        key={index}

                                        className="bg-white rounded-xl border p-4"

                                    >

                                        <div className="font-semibold text-blue-700">

                                            Step {index + 1}

                                        </div>

                                        <p className="mt-2">

                                            {step.action}

                                        </p>

                                        <div className="mt-4 bg-green-50 border-l-4 border-green-500 p-3 rounded">

                                            <span className="font-semibold text-green-700">

                                                Expected Result

                                            </span>

                                            <p className="mt-1 text-green-700">

                                                {step.expectedResult}

                                            </p>

                                        </div>

                                    </div>

                                ))}

                            </div>

                        </div>

                        {/* Test Data */}

                        <div className="mt-6">

                            <h4 className="font-bold text-slate-800 mb-2">

                                🗂 Test Data

                            </h4>

                            <div className="bg-white rounded-xl border p-4">

                                {

                                    typeof testCase.testData === "object"

                                        ? Object.entries(testCase.testData)

                                            .map(

                                                ([key, value]) =>

                                                    `${key}: ${value}`

                                            )

                                            .join(", ")

                                        : testCase.testData

                                }

                            </div>

                        </div>

                        {/* Design Technique */}

                        <div className="mt-6">

                            <h4 className="font-bold text-slate-800 mb-2">

                                🧠 Design Technique

                            </h4>

                            <span className="inline-block bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full">

                                {testCase.designTechnique}

                            </span>

                        </div>

                    </div>

                ))}

            </div>

        </div>

    );

}