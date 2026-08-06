interface Props {
    review: any;
}

export default function ReviewResult({ review }: Props) {

    if (!review) {
        return null;
    }

    if (review.error) {
        return (
            <div className="bg-red-50 border border-red-300 rounded-lg p-4">
                <h2 className="font-bold text-red-700">
                    AI Review Failed
                </h2>

                <p>{review.error}</p>
            </div>
        );
    }

    return (

        <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 mt-8">

            <h2 className="text-2xl font-bold mb-6">
                🤖 AI Review
            </h2>

            <div className="space-y-4">

                <div>
                    <strong>Overall Score:</strong> {review.overallScore}/100
                </div>

                <div>
                    <strong>Quality:</strong> {review.quality}
                </div>

                <div>

                    <strong>Coverage</strong>

                    <ul className="list-disc list-inside mt-2">

                        {Object.entries(review.coverage).map(([key, value]) => (

                            <li key={key}>
                                {key}: {String(value)}
                            </li>

                        ))}

                    </ul>

                </div>

                <div>

                    <strong>Missing Scenarios</strong>

                    <ul className="list-disc list-inside mt-2">

                        {review.missingScenarios.map(
                            (item: string, index: number) => (
                                <li key={index}>{item}</li>
                            )
                        )}

                    </ul>

                </div>

                <div>

                    <strong>Recommendations</strong>

                    <ul className="list-disc list-inside mt-2">

                        {review.recommendations.map(
                            (item: string, index: number) => (
                                <li key={index}>{item}</li>
                            )
                        )}

                    </ul>

                </div>

                <div>
                    <strong>Risk Level:</strong> {review.riskLevel}
                </div>

            </div>

        </div>

    );
}