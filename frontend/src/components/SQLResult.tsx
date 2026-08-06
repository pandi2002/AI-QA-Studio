import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

import toast from "react-hot-toast";

interface Props {
    sql: string;
}

export default function SQLResult({ sql }: Props) {

    if (!sql) return null;

    const copySQL = async () => {

        await navigator.clipboard.writeText(sql);

        toast.success("SQL copied successfully!");

    };

    const downloadSQL = () => {

        const blob = new Blob([sql], {
            type: "text/sql",
        });

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;

        link.download = "verification.sql";

        link.click();

        URL.revokeObjectURL(url);

    };

    return (

        <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 mt-8">

            <div className="flex justify-between items-center mb-4">

                <div>

                    <h2 className="text-2xl font-bold text-slate-800">
                        🗄️ SQL Verification
                    </h2>

                    <p className="text-slate-500 mt-1">
                        AI Generated Database Verification Queries
                    </p>

                </div>

                <div className="flex gap-3">

                    <button
                        onClick={copySQL}
                        className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        Copy
                    </button>

                    <button
                        onClick={downloadSQL}
                        className="px-5 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white"
                    >
                        Download
                    </button>

                </div>

            </div>

            <SyntaxHighlighter
                language="sql"
                style={vscDarkPlus}
                showLineNumbers
                wrapLongLines
                customStyle={{
                    borderRadius: "16px",
                    fontSize: "14px",
                    padding: "24px",
                    margin: 0,
                }}
            >
                {sql}
            </SyntaxHighlighter>

        </div>

    );
}