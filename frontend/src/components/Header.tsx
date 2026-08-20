import type { User } from "../types/user";

type HeaderProps = {
    provider: string;
    setProvider: React.Dispatch<React.SetStateAction<string>>;
    user: User | null;
    onOpenAuthModal: () => void;
    onLogout: () => void;
};

export default function Header({
    provider,
    setProvider,
    user,
    onOpenAuthModal,
    onLogout,
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
                    flex-col
                    md:flex-row
                    md:items-center
                    justify-between
                    gap-4
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

                <div className="flex items-center gap-4 flex-wrap">

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

                    {/* User Auth Controls */}

                    {user ? (
                        <div className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-2 text-white text-sm">
                            <span className="font-semibold text-blue-200">👤 {user.name}</span>
                            <button
                                onClick={onLogout}
                                className="text-xs bg-red-500/80 hover:bg-red-600 px-3 py-1 rounded-lg text-white font-medium transition"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={onOpenAuthModal}
                            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition shadow-md flex items-center gap-2"
                        >
                            🔐 Sign In / Register
                        </button>
                    )}

                </div>

            </div>

        </header>

    );

}