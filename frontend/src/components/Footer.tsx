
export default function Footer() {
    return (

        <footer className="mt-20 bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white">

            <div className="max-w-7xl mx-auto px-6 py-10">

                {/* Top Section */}

                <div className="flex flex-col lg:flex-row items-center justify-between gap-8">

                    {/* Logo & Description */}

                    <div>

                        <h2 className="text-3xl font-bold flex items-center gap-3">

                            🤖 AI QA Studio

                            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                                v2.1
                            </span>

                        </h2>

                        <p className="mt-3 text-blue-100">

                            AI-Powered Quality Assurance Platform

                        </p>

                        <p className="mt-2 text-sm text-blue-200">

                            Generate Test Cases • Playwright Automation •
                            AI Review • Bug Reporting

                        </p>

                    </div>

                    {/* Technology Badges */}

                    <div className="flex flex-wrap justify-center gap-3">

                        <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur text-white text-sm">
                            ⚛ React
                        </span>

                        <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur text-white text-sm">
                            🔷 TypeScript
                        </span>

                        <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur text-white text-sm">
                            🚀 FastAPI
                        </span>

                        <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur text-white text-sm">
                            🎭 Playwright
                        </span>

                        <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur text-white text-sm">
                            ✨ Gemini
                        </span>

                        <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur text-white text-sm">
                            ⚡ Groq
                        </span>

                    </div>

                </div>

                {/* Divider */}

                <div className="my-8 h-px bg-white/20"></div>

                {/* Bottom Section */}

                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">

                    <p className="text-blue-100">

                        Developed with ❤️ by <strong>Raja P</strong>

                    </p>

                    <p className="text-blue-200">

                        © 2026 AI QA Studio. All Rights Reserved.

                    </p>

                </div>

            </div>

        </footer>

    );
}