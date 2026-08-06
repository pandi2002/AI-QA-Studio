import type { ReactNode } from "react";

interface CardProps {
    title?: string;
    children: ReactNode;
}

export default function Card({ title, children }: CardProps) {
    return (
        <div
            className="
                bg-white
                rounded-2xl
                border
                border-slate-200
                shadow-sm
                hover:shadow-xl
                hover:-translate-y-1
                transition-all
                duration-300
                overflow-hidden
            "
        >

            <div
                className="
                    px-6
                    py-4
                    border-b
                    bg-gradient-to-r
                    from-slate-50
                    to-blue-50
                "
            >

                <h2
                    className="
                        text-xl
                        font-bold
                        text-slate-800
                    "
                >
                    {title}
                </h2>

            </div>

            <div className="p-6">

                {children}

            </div>

        </div>

    );

}