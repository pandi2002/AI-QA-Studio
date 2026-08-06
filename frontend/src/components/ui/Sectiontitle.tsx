import type { ReactNode } from "react";

interface Props {
    title?: string;
    children: ReactNode;

}

export default function SectionTitle({

    children,

}: Props) {

    return (

        <h2 className="

            text-lg

            font-semibold

            text-slate-800

            mb-4

        ">

            {children}

        </h2>

    );

}