interface Props {

    label: string;

    checked: boolean;

    onChange: () => void;

}

export default function Checkbox({

    label,

    checked,

    onChange,

}: Props) {

    return (

        <label className="flex items-center gap-3 cursor-pointer">

            <input

                type="checkbox"

                checked={checked}

                onChange={onChange}

                className="h-5 w-5"

            />

            <span>{label}</span>

        </label>

    );

}