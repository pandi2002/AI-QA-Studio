interface Props {

    value: string;

    onChange: (value: string) => void;

    placeholder?: string;

}

export default function TextArea({

    value,

    onChange,

    placeholder,

}: Props) {

    return (

        <textarea

            rows={8}

            value={value}

            onChange={(e) => onChange(e.target.value)}

            placeholder={placeholder}

            className="

                w-full

                rounded-xl

                border

                border-slate-300

                p-4

                focus:ring-2

                focus:ring-blue-500

                focus:outline-none

                resize-none

            "

        />

    );

}