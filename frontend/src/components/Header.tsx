type HeaderProps = {
    provider: string;
    setProvider: React.Dispatch<React.SetStateAction<string>>;
};

export default function Header({
    provider,
    setProvider,
}: HeaderProps) {

    return (

        <header
            className="
                bg-gradient-to-r
                from-slate-900
                via-blue-900
                to-indigo-900
                shadow-lg
            "
        >

            <div
                className="
                    max-w-7xl
                    mx-auto
                    px-8
                    py-6
                    flex
                    items-center
                    justify-between
                "
            >

                {/* Left Side */}

                <div>

                    <h1
                        className="
                            text-4xl
                            font-extrabold
                            text-white
                            tracking-wide
                        "
                    >
                        🤖 AI QA Studio
                    </h1>

                    <p
                        className="
                            text-blue-100
                            mt-2
                            text-sm
                        "
                    >
                        Intelligent Test Case Generation • Playwright Automation • AI Review • Bug Reporting
                    </p>

                </div>

                {/* Right Side */}

                <div className="flex items-center gap-3">

                    {/* AI Provider */}

                    <div className="flex bg-white/10 rounded-xl p-1">

                        <button
                            onClick={() => setProvider("gemini")}
                            className={`
                                px-4
                                py-2
                                rounded-lg
                                text-sm
                                font-semibold
                                transition-all
                                duration-300
                                ${provider === "gemini"
                                    ? "bg-white text-blue-700 shadow"
                                    : "text-white hover:bg-white/20"
                                }
                            `}
                        >
                            ✨ Gemini
                        </button>

                        <button
                            onClick={() => setProvider("groq")}
                            className={`
                                px-4
                                py-2
                                rounded-lg
                                text-sm
                                font-semibold
                                transition-all
                                duration-300
                                ${provider === "groq"
                                    ? "bg-white text-blue-700 shadow"
                                    : "text-white hover:bg-white/20"
                                }
                            `}
                        >
                            ⚡ Groq
                        </button>

                    </div>

                </div>

            </div>

        </header>

    );

}