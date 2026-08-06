export interface BugReport {

    title: string;

    severity: string;

    priority: string;

    description: string;

    stepsToReproduce: string[];

    expectedResult: string;

    actualResult: string;

}