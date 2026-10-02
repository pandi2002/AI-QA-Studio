interface Props {
    review: any;
}

export default function ReviewResult({ review }: Props) {
    if (!review) {
        return null;
    }

    if (review.error) {
        return (
            <div className="bg-red-50 border border-red-300 rounded-lg p-4 mt-8">
                <h2 className="font-bold text-red-700">
                    AI Review Failed
                </h2>
                <p className="text-red-600 mt-1">{review.error}</p>
            </div>
        );
    }

    const coverageEntries = (review.coverage && typeof review.coverage === "object")
        ? Object.entries(review.coverage)
        : [];

    const missingScenarios: string[] = Array.isArray(review.missingScenarios)
        ? review.missingScenarios
        : typeof review.missingScenarios === "string"
        ? [review.missingScenarios]
        : [];

    const recommendations: string[] = Array.isArray(review.recommendations)
        ? review.recommendations
        : typeof review.recommendations === "string"
        ? [review.recommendations]
        : [];

    return (
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 mt-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
                🤖 AI Review
            </h2>

            <div className="space-y-4 text-slate-700">
                <div>
                    <strong>Overall Score:</strong> {review.overallScore ?? "N/A"}/100
                </div>

                {review.quality && (
                    <div>
                        <strong>Quality:</strong> {review.quality}
                    </div>
                )}

                {coverageEntries.length > 0 && (
                    <div>
                        <strong>Coverage</strong>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                            {coverageEntries.map(([key, value]) => (
                                <li key={key}>
                                    <span className="font-semibold">{key}:</span> {String(value)}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {missingScenarios.length > 0 && (
                    <div>
                        <strong>Missing Scenarios</strong>
                        <ul className="list-disc list-inside mt-2 space-y-1 text-amber-700">
                            {missingScenarios.map((item: string, index: number) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {recommendations.length > 0 && (
                    <div>
                        <strong>Recommendations</strong>
                        <ul className="list-disc list-inside mt-2 space-y-1 text-blue-700">
                            {recommendations.map((item: string, index: number) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {review.riskLevel && (
                    <div>
                        <strong>Risk Level:</strong>{" "}
                        <span className={`font-semibold ${
                            review.riskLevel === "High" ? "text-red-600" :
                            review.riskLevel === "Medium" ? "text-yellow-600" : "text-green-600"
                        }`}>
                            {review.riskLevel}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}