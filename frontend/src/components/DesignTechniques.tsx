import CheckboxGroup from "./ui/CheckboxGroup";

interface Props {
    designTechniques: string[];
    setDesignTechniques: (value: string[]) => void;
}

const options = [
    { value: "BVA", label: "📏 Boundary Value Analysis" },
    { value: "EP", label: "🧩 Equivalence Partitioning" },
    { value: "Decision Table", label: "📋 Decision Table" },
    { value: "State Transition", label: "🔄 State Transition" },
    { value: "Use Case", label: "👤 Use Case Testing" },
    { value: "Error Guessing", label: "💡 Error Guessing" },
    { value: "Pairwise", label: "🔀 Pairwise Testing" },
];

export default function DesignTechniques({
    designTechniques,
    setDesignTechniques,
}: Props) {
    return (
        <CheckboxGroup
            title="🧠 Test Design Techniques"
            options={options}
            selected={designTechniques}
            onChange={setDesignTechniques}
            columns={2}
        />
    );
}