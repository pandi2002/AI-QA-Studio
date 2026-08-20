interface Props {
    execution: any;
    actionsUrl?: string;
    reportUrl?: string;
    mode?: string;
}

export default function ExecutionSummary({ execution, actionsUrl, reportUrl, mode }: Props) {

    if (!execution && !actionsUrl && mode !== "github") return null;

    if (mode === "github" || actionsUrl) {
        return (
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">
                            🚀 GitHub Actions Automation Triggered
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">
                            Playwright test uploaded & workflow dispatched on GitHub Actions.
                        </p>
                    </div>

                    <span className="px-4 py-2 rounded-full text-sm font-semibold bg-blue-100 text-blue-700 animate-pulse">
                        ⚡ WORKFLOW RUNNING
                    </span>
                </div>

                <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 space-y-4">
                    <p className="text-slate-700 font-medium">
                        The Playwright test has been uploaded to your repository and the workflow is executing on GitHub Actions runner.
                    </p>

                    <div className="flex flex-wrap gap-4 pt-2">
                        {actionsUrl && (
                            <a
                                href={actionsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm transition shadow flex items-center gap-2"
                            >
                                🐙 View GitHub Action Logs
                            </a>
                        )}

                        {reportUrl && (
                            <a
                                href={reportUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition shadow flex items-center gap-2"
                            >
                                📊 View Allure Report (GitHub Pages)
                            </a>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    const allPassed =
        execution.failed === 0 && execution.broken === 0;

    return (

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">

            {/* Header */}

            <div className="flex items-center justify-between mb-6">

                <div>

                    <h2 className="text-2xl font-bold text-slate-800">
                        🚀 Automation Execution Summary
                    </h2>

                    <p className="text-sm text-slate-500 mt-1">
                        Latest Playwright execution results
                    </p>

                </div>

                <span className={`px-4 py-2 rounded-full text-sm font-semibold
                    ${allPassed
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}>

                    {allPassed ? "✔ PASSED" : "✖ FAILED"}

                </span>

            </div>

            {/* Statistics */}

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-5">

                {/* Passed */}

                <div className="rounded-2xl border border-green-200 bg-green-50 p-5 text-center shadow-sm hover:shadow-md transition">

                    <div className="text-4xl mb-2">✅</div>

                    <div className="text-3xl font-bold text-green-600">
                        {execution.passed ?? 0}
                    </div>

                    <div className="mt-2 text-green-700 font-medium">
                        Passed
                    </div>

                </div>

                {/* Failed */}

                <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-center shadow-sm hover:shadow-md transition">

                    <div className="text-4xl mb-2">❌</div>

                    <div className="text-3xl font-bold text-red-600">
                        {execution.failed ?? 0}
                    </div>

                    <div className="mt-2 text-red-700 font-medium">
                        Failed
                    </div>

                </div>

                {/* Broken */}

                <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5 text-center shadow-sm hover:shadow-md transition">

                    <div className="text-4xl mb-2">⚠️</div>

                    <div className="text-3xl font-bold text-orange-600">
                        {execution.broken ?? 0}
                    </div>

                    <div className="mt-2 text-orange-700 font-medium">
                        Broken
                    </div>

                </div>

                {/* Skipped */}

                <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-5 text-center shadow-sm hover:shadow-md transition">

                    <div className="text-4xl mb-2">⏭️</div>

                    <div className="text-3xl font-bold text-yellow-600">
                        {execution.skipped ?? 0}
                    </div>

                    <div className="mt-2 text-yellow-700 font-medium">
                        Skipped
                    </div>

                </div>

                {/* Duration */}

                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 text-center shadow-sm hover:shadow-md transition">

                    <div className="text-4xl mb-2">⏱️</div>

                    <div className="text-3xl font-bold text-blue-600">
                        {execution.duration ?? 0}s
                    </div>

                    <div className="mt-2 text-blue-700 font-medium">
                        Duration
                    </div>

                </div>

            </div>

            {/* Overall Result */}

            <div className="mt-8">

                {allPassed ? (

                    <div className="rounded-xl border border-green-200 bg-green-50 p-5">

                        <h3 className="text-lg font-semibold text-green-700">
                            🎉 Automation Completed Successfully
                        </h3>

                        <p className="text-green-600 mt-2">
                            All generated Playwright test cases executed successfully.
                            No failures or broken tests were detected.
                        </p>

                    </div>

                ) : (

                    <div className="rounded-xl border border-red-200 bg-red-50 p-5">

                        <h3 className="text-lg font-semibold text-red-700">
                            ⚠️ Automation Requires Attention
                        </h3>

                        <p className="text-red-600 mt-2">
                            Some test cases failed or were marked as broken.
                            Open the Allure Report to review screenshots, videos,
                            traces and detailed error information.
                        </p>

                    </div>

                )}

            </div>

        </div>

    );

}