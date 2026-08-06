import Button from "./ui/Button";

interface Props {
    onRecommend: () => void;
    onGenerateTestCases: () => void;
    onGeneratePlaywright: () => void;
    onGenerateBugReport: () => void;

    onRunAutomation: () => void;
    onGenerateSQL: () => void;
    onViewReport: () => void;

    onExportExcel: () => void;
    onExportPDF: () => void;

    onCopyTestCases: () => void;
    onCopyJson: () => void;

    onClear: () => void;
}

export default function ActionButtons({

    onRecommend,
    onGenerateTestCases,
    onGeneratePlaywright,
    onGenerateBugReport,

    onRunAutomation,
    onGenerateSQL,
    onViewReport,

    onExportExcel,
    onExportPDF,

    onCopyTestCases,
    onCopyJson,

    onClear,

}: Props) {

    return (

        <div className="space-y-8">

            {/* AI Section */}

            <div
                className="
                    bg-white
                    rounded-2xl
                    border
                    border-slate-200
                    shadow-lg
                    overflow-hidden
                "
            >

                <div
                    className="
                        px-6
                        py-4
                        border-b
                        bg-gradient-to-r
                        from-blue-50
                        to-indigo-50
                    "
                >

                    <h2 className="text-2xl font-bold text-slate-800">

                        🤖 AI Workspace

                    </h2>

                    <p className="text-sm text-slate-500 mt-1">

                        Generate everything using AI

                    </p>

                </div>

                <div className="p-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

                        <Button onClick={onGenerateTestCases}>
                            🧪 Generate Test Cases
                        </Button>

                        <Button onClick={onGeneratePlaywright}>
                            🎭 Generate Playwright
                        </Button>

                        <Button onClick={onRunAutomation}>
                            ▶ Run Automation
                        </Button>

                        <Button onClick={onViewReport}>
                            📊 View Allure Report
                        </Button>

                        <Button onClick={onGenerateSQL}>
                            🗄️ Generate SQL
                        </Button>

                        <Button onClick={onRecommend}>
                            🤖 AI Review
                        </Button>

                        <Button onClick={onGenerateBugReport}>
                            🐞 Generate Bug Report
                        </Button>

                    </div>

                </div>

            </div>

            {/* Output Section */}

            <div
                className="
                    bg-white
                    rounded-2xl
                    border
                    border-slate-200
                    shadow-lg
                    overflow-hidden
                "
            >

                <div
                    className="
                        px-6
                        py-4
                        border-b
                        bg-gradient-to-r
                        from-green-50
                        to-emerald-50
                    "
                >

                    <h2 className="text-2xl font-bold text-slate-800">

                        📤 Export & Utilities

                    </h2>

                    <p className="text-sm text-slate-500 mt-1">

                        Export, Copy and Manage Results

                    </p>

                </div>

                <div className="p-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5">

                        <Button onClick={onExportExcel}>
                            📊 Export Excel
                        </Button>

                        <Button onClick={onExportPDF}>
                            📄 Export PDF
                        </Button>

                        <Button
                            variant="secondary"
                            onClick={onCopyTestCases}
                        >
                            📋 Copy Test Cases
                        </Button>

                        <Button
                            variant="secondary"
                            onClick={onCopyJson}
                        >
                            🧾 Copy JSON
                        </Button>

                        <Button
                            variant="danger"
                            onClick={onClear}
                        >
                            🗑 Clear Results
                        </Button>

                    </div>

                </div>

            </div>

        </div>

    );

}