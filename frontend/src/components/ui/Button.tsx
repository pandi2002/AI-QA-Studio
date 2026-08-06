import type { ReactNode } from "react";

interface Props {
    title?: string;
    children: ReactNode;

    onClick?: () => void;

    disabled?: boolean;

    variant?: "primary" | "secondary" | "danger";
}

export default function Button({
    children,
    onClick,
    disabled,
    variant = "primary",
}: Props) {

    const styles = {

        primary:
            `
            bg-blue-600
            hover:bg-blue-700
            text-white
            hover:shadow-blue-300
            `,

        secondary:
            `
            bg-slate-100
            hover:bg-slate-200
            text-slate-700
            border
            border-slate-300
            hover:border-slate-400
            `,

        danger:
            `
            bg-red-600
            hover:bg-red-700
            text-white
            hover:shadow-red-300
            `,
    };

    return (

        <button

            onClick={onClick}

            disabled={disabled}

            className={`

                w-full

                px-5

                py-3

                rounded-xl

                font-semibold

                text-sm

                transition-all

                duration-300

                shadow-sm

                hover:shadow-lg

                hover:-translate-y-0.5

                active:scale-95

                disabled:opacity-50

                disabled:cursor-not-allowed

                ${styles[variant]}

            `}
        >

            {children}

        </button>

    );

}