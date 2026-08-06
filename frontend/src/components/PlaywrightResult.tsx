import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import toast from "react-hot-toast";

import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface Props {
    code: string;
}

export default function PlaywrightResult({ code }: Props) {

    if (!code) return null;

    const copyCode = async () => {
        await navigator.clipboard.writeText(code);
        toast.success("Playwright code copied!");
    };

    const downloadCode = () => {

        const blob = new Blob(
            [code],
            {
                type: "text/typescript",
            }
        );

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;

        link.download = "playwright.spec.ts";

        link.click();

        URL.revokeObjectURL(url);

    };

    return (

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">

            {/* Header */}

            <div className="flex justify-between items-center px-6 py-4 border-b bg-slate-50">

                <div>

                    <h2 className="text-2xl font-bold text-slate-800">

                        🎭 Generated Playwright Script

                    </h2>

                    <p className="text-sm text-slate-500 mt-1">

                        Ready to execute with Playwright

                    </p>

                </div>

                <div className="flex gap-3 flex-wrap">

                    <button
                        onClick={copyCode}
                        className="px-5
                        py-2
                        rounded-xl
                        bg-blue-600
                        hover:bg-blue-700
                        text-white
                        transition
                        shadow-md
                        hover:shadow-lg
                    "
                    >

                        📋 Copy

                    </button>

                    <button
                        onClick={downloadCode}
                        className="
                        px-5
                        py-2
                        rounded-xl
                        bg-green-600
                        hover:bg-green-700
                        text-white
                        transition
                        shadow-md
                        hover:shadow-lg
                    "
                    >

                        ⬇ Download

                    </button>

                </div>

            </div>

            {/* Code */}

            <div className="bg-[#1E1E1E]">

                <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-700">

                    <div className="w-3 h-3 rounded-full bg-red-500"></div>

                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>

                    <div className="w-3 h-3 rounded-full bg-green-500"></div>

                    <span className="ml-4 text-slate-300 text-sm">

                        playwright.spec.ts

                    </span>

                </div>

                <SyntaxHighlighter
                    language="typescript"
                    style={vscDarkPlus}
                    showLineNumbers
                    wrapLongLines
                    customStyle={{
                        borderRadius: "16px",
                        fontSize: "14px",
                        padding: "24px",
                        margin: 0,
                        maxHeight: "650px",
                    }}
                >
                    {code}
                </SyntaxHighlighter>
            </div>

        </div>

    );

}