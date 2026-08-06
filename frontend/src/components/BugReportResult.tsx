interface Props {
    bugReport: any;
}

export default function BugReportResult({ bugReport }: Props) {

    if (!bugReport || !bugReport.bugs || bugReport.bugs.length === 0) {
        return null;
    }

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6">

            <h2 className="text-2xl font-bold text-slate-800 mb-6">
                🐞 Bug Report
            </h2>

            <div className="space-y-6">

                {bugReport.bugs.map((bug: any, index: number) => (

                    <div
                        key={index}
                        className="border rounded-xl p-5 bg-slate-50"
                    >

                        <div className="flex justify-between items-center mb-4">

                            <div>
                                <h3 className="text-lg font-semibold">
                                    {bug.bugId} - {bug.title}
                                </h3>

                                <p className="text-sm text-gray-500">
                                    Module: {bug.module}
                                </p>
                            </div>

                            <div className="flex gap-2">

                                <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm">
                                    {bug.severity}
                                </span>

                                <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm">
                                    {bug.priority}
                                </span>

                                <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
                                    {bug.status}
                                </span>

                            </div>

                        </div>

                        <div className="space-y-4">

                            <div>
                                <h4 className="font-semibold">
                                    Preconditions
                                </h4>

                                <p>{bug.preconditions}</p>
                            </div>

                            <div>

                                <h4 className="font-semibold">
                                    Steps to Reproduce
                                </h4>

                                <ol className="list-decimal ml-6">

                                    {bug.steps.map((step: string, i: number) => (

                                        <li key={i}>
                                            {step.replace(/^\d+\.\s*/, "")}
                                        </li>

                                    ))}

                                </ol>

                            </div>

                            <div>

                                <h4 className="font-semibold text-green-700">
                                    Expected Result
                                </h4>

                                <p>{bug.expectedResult}</p>

                            </div>

                            <div>

                                <h4 className="font-semibold text-red-700">
                                    Actual Result
                                </h4>

                                <p>{bug.actualResult}</p>

                            </div>

                        </div>

                    </div>

                ))}

            </div>

        </div>
    );
}