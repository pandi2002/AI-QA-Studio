import type { ReactNode } from "react";

interface CheckboxOption {
    value: string;
    label: ReactNode;
}

interface CheckboxGroupProps {
    title: string;
    options: CheckboxOption[];
    selected: string[];
    onChange: (selected: string[]) => void;
    columns?: number;
}

export default function CheckboxGroup({
    title,
    options,
    selected,
    onChange,
    columns = 3,
}: CheckboxGroupProps) {

    const toggle = (option: string) => {

        if (selected.includes(option)) {

            onChange(
                selected.filter(item => item !== option)
            );

        } else {

            onChange([
                ...selected,
                option
            ]);

        }

    };

    const gridCols = {
        2: "md:grid-cols-2",
        3: "md:grid-cols-3",
        4: "md:grid-cols-4",
    };

    return (

        <div
            className="
                bg-white
                rounded-2xl
                shadow-sm
                border
                border-slate-200
                p-6
                hover:shadow-xl
                transition-all
                duration-300
            "
        >

            {/* Title */}

            <h2
                className="
                    text-xl
                    font-bold
                    text-slate-800
                    mb-6
                "
            >
                {title}
            </h2>

            {/* Options */}

            <div
                className={`
                    grid
                    grid-cols-1
                    ${gridCols[columns as 2 | 3 | 4]}
                    gap-4
                `}
            >

                {options.map(option => {

                    const checked =
                        selected.includes(option.value);

                    return (

                        <label

                            key={option.value}

                            className={`
                                flex
                                items-center
                                gap-3
                                cursor-pointer
                                rounded-xl
                                border
                                p-4
                                transition-all
                                duration-300
                                hover:shadow-md
                                hover:-translate-y-0.5

                                ${checked
                                    ? `
                                            bg-blue-600
                                            border-blue-600
                                            text-white
                                            shadow-lg
                                          `
                                    : `
                                            bg-white
                                            border-slate-200
                                            hover:border-blue-400
                                            hover:bg-blue-50
                                          `
                                }
                            `}
                        >

                            <input

                                type="checkbox"

                                checked={checked}

                                onChange={() => toggle(option.value)}

                                className="
                                    h-5
                                    w-5
                                    accent-blue-600
                                    cursor-pointer
                                "
                            />

                            <span
                                className={`
                                    flex
                                    items-center
                                    gap-2
                                    font-medium

                                    ${checked
                                        ? "text-white"
                                        : "text-slate-700"
                                    }
                                `}
                            >
                                {option.label}
                            </span>

                        </label>

                    );

                })}

            </div>

            {/* Footer */}

            <div
                className="
                    mt-5
                    flex
                    justify-end
                "
            >

                <span
                    className="
                        text-sm
                        text-slate-500
                    "
                >
                    Selected :
                    <span className="font-semibold text-blue-600">
                        {" "}
                        {selected.length}
                    </span>
                </span>

            </div>

        </div>

    );

}