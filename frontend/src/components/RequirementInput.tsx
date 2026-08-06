import Card from "./ui/Card";

interface Props {
    requirement: string;
    setRequirement: (value: string) => void;
    images: File[];
    setImages: (files: File[]) => void;
}

export default function RequirementInput({
    requirement,
    setRequirement,
    setImages,
}: Props) {
    return (
        <Card title="Requirement">

            {/* Requirement Input */}
            <div className="relative">

                {/* Icon */}
                <span className="absolute left-4 top-4 text-xl text-blue-600">
                    📝
                </span>

                <textarea
                    rows={8}
                    value={requirement}
                    onChange={(e) => setRequirement(e.target.value)}
                    placeholder="Describe your software requirement, feature, user story, bug, or upload UI screenshots for AI-powered analysis..."
                    className="
                        w-full
                        rounded-2xl
                        border
                        border-slate-300
                        bg-white
                        p-5
                        pl-12
                        resize-none
                        shadow-sm
                        transition-all
                        duration-300
                        focus:border-blue-500
                        focus:ring-4
                        focus:ring-blue-100
                        focus:outline-none
                        hover:border-slate-400
                    "
                />

                {/* Character Counter */}
                <div className="absolute bottom-3 right-4 text-xs text-slate-500">
                    {requirement.length} Characters
                </div>

            </div>

            {/* Hint */}
            <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-slate-600">
                💡 <strong>Tip:</strong> Provide detailed requirements or upload UI screenshots to generate more accurate AI Test Cases, Playwright automation, Bug Reports, and AI Reviews.
            </div>

            {/* Screenshot Upload */}
            <div className="mt-6">

                <label className="block text-sm font-semibold mb-2">
                    📷 Upload UI Screenshot(s)
                </label>

                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) =>
                        setImages(Array.from(e.target.files || []))
                    }
                    className="
                        block
                        w-full
                        text-sm
                        text-gray-500
                        file:mr-4
                        file:rounded-lg
                        file:border-0
                        file:bg-blue-600
                        file:text-white
                        file:px-4
                        file:py-2
                        hover:file:bg-blue-700
                        cursor-pointer
                    "
                />

                <p className="mt-2 text-xs text-slate-500">
                    Supported formats: PNG, JPG, JPEG, WEBP • Multiple screenshots supported.
                </p>

            </div>

        </Card>
    );
}