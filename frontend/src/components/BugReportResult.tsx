interface Props {
    bugReport: any;
}

export default function BugReportResult({ bugReport }: Props) {
    if (!bugReport || !bugReport.bugs || !Array.isArray(bugReport.bugs) || bugReport.bugs.length === 0) {
        return null;
    }

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 mt-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
                🐞 Bug Report
            </h2>

            <div className="space-y-6">
                {bugReport.bugs.map((bug: any, index: number) => {
                    if (!bug || typeof bug !== "object") return null;

                    const bugId = bug.bugId || `BUG-${index + 1}`;
                    const title = bug.title || "Untitled Bug";
                    const moduleName = bug.module || "General";
                    const severity = bug.severity || "Medium";
                    const priority = bug.priority || "Medium";
                    const status = bug.status || "Open";

                    const steps: string[] = Array.isArray(bug.steps)
                        ? bug.steps.map((s: any) => String(s))
                        : typeof bug.steps === "string"
                        ? [bug.steps]
                        : [];

                    return (
                        <div
                            key={bugId + "-" + index}
                            className="border rounded-xl p-5 bg-slate-50 shadow-sm"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-800">
                                        {bugId} - {title}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Module: {moduleName}
                                    </p>
                                </div>

                                <div className="flex gap-2">
                                    <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-semibold">
                                        {severity}
                                    </span>
                                    <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm font-semibold">
                                        {priority}
                                    </span>
                                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
                                        {status}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4 text-slate-700">
                                {bug.preconditions && (
                                    <div>
                                        <h4 className="font-semibold text-slate-800">
                                            Preconditions
                                        </h4>
                                        <p className="mt-1">{String(bug.preconditions)}</p>
                                    </div>
                                )}

                                {steps.length > 0 && (
                                    <div>
                                        <h4 className="font-semibold text-slate-800">
                                            Steps to Reproduce
                                        </h4>
                                        <ol className="list-decimal ml-6 mt-1 space-y-1">
                                            {steps.map((stepStr: string, i: number) => (
                                                <li key={i}>
                                                    {stepStr.replace(/^\d+\.\s*/, "")}
                                                </li>
                                            ))}
                                        </ol>
                                    </div>
                                )}

                                {bug.expectedResult && (
                                    <div>
                                        <h4 className="font-semibold text-green-700">
                                            Expected Result
                                        </h4>
                                        <p className="mt-1">{String(bug.expectedResult)}</p>
                                    </div>
                                )}

                                {bug.actualResult && (
                                    <div>
                                        <h4 className="font-semibold text-red-700">
                                            Actual Result
                                        </h4>
                                        <p className="mt-1">{String(bug.actualResult)}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}