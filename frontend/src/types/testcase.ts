export interface TestStep {
    action: string;
    expectedResult: string;
}

export interface TestCase {
    testCaseId: string;
    category: string;
    priority: string;
    scenario: string;
    preconditions: string[];
    steps: TestStep[];
    testData: string;
    designTechnique: string;
}

export interface TestCaseResponse {
    module: string;
    testCases: TestCase[];
}