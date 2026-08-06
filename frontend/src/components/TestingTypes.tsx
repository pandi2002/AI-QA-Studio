import CheckboxGroup from "./ui/CheckboxGroup";

interface Props {
    testingTypes: string[];
    setTestingTypes: (value: string[]) => void;
}

const options = [
    { value: "Smoke", label: "🧪 Smoke" },
    { value: "Sanity", label: "✅ Sanity" },
    { value: "Functional", label: "⚙️ Functional" },
    { value: "Regression", label: "🔄 Regression" },
    { value: "Integration", label: "🔗 Integration" },
    { value: "System", label: "🖥️ System" },
    { value: "API", label: "🌐 API" },
    { value: "Positive", label: "👍 Positive" },
    { value: "Negative", label: "👎 Negative" },
    { value: "Boundary", label: "📏 Boundary" },
    { value: "Security", label: "🔒 Security" },
    { value: "Performance", label: "⚡ Performance" },
    { value: "Accessibility", label: "♿ Accessibility" },
];

export default function TestingTypes({
    testingTypes,
    setTestingTypes,
}: Props) {
    return (
        <CheckboxGroup
            title="🧪 Testing Types"
            options={options}
            selected={testingTypes}
            onChange={setTestingTypes}
            columns={3}
        />
    );
}