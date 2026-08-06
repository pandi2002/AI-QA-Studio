import { useState } from "react";
import toast from "react-hot-toast";
import Header from "./components/Header";
import RequirementInput from "./components/RequirementInput";
import TestingTypes from "./components/TestingTypes";

import type { Execution } from "./types/execution";

import type { Review } from "./types/review";

import type { BugReport } from "./types/bugreport";

import { SUCCESS_MESSAGES, ERROR_MESSAGES, VALIDATION_MESSAGES, LOADING_MESSAGES } from "./constants/messages";
import DesignTechniques from "./components/DesignTechniques";
import ActionButtons from "./components/ActionButtons";
import Results from "./components/Results";
import Footer from "./components/Footer";
import PlaywrightResult from "./components/PlaywrightResult";
import ReviewResult from "./components/ReviewResult";
import type { TestCaseResponse } from "./types/testcase";
import BugReportResult from "./components/BugReportResult";
import ExecutionSummary from "./components/ExecutionSummary";
import SQLResult from "./components/SQLResult";
import { generateTestCases, exportExcel, exportPdf, generatePlaywright, generateSQL, generateReview, generateBugReport, runAutomation } from "./services/api";

function App() {
  const [provider, setProvider] = useState("gemini");
  const [requirement, setRequirement] = useState("");
  const [testingTypes, setTestingTypes] = useState<string[]>([]);
  const [designTechniques, setDesignTechniques] = useState<string[]>([]);
  const [playwrightCode, setPlaywrightCode] = useState("");
  const [sqlCode, setSqlCode] = useState("");
  const [review, setReview] = useState<Review | null>(null);
  const [bugReport, setBugReport] = useState<BugReport | null>(null);
  const [execution, setExecution] = useState<Execution | null>(null);

  const [stdout, setStdout] = useState("");

  const [stderr, setStderr] = useState("");

  const [images, setImages] = useState<File[]>([]);

  const [result, setResult] = useState<TestCaseResponse | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function resetExecution() {
    setExecution(null);
    setStdout("");
    setStderr("");
  }

  function resetAIResults() {
    setReview(null);
    setBugReport(null);
    setPlaywrightCode("");
    setSqlCode("");
  }

  function clearLoadingMessage() {
    setMessage("");
    setLoading(false);
  }

  //==================================
  // HANDLE GENERATE TEST CASES:
  //==================================
  async function handleGenerateTestCases() {
    // Validation
    if (!requirement.trim() && images.length === 0) {
      toast.error(VALIDATION_MESSAGES.REQUIREMENT);
      return;
    }

    if (testingTypes.length === 0) {
      toast.error(VALIDATION_MESSAGES.TESTING_TYPE);
      return;
    }

    try {
      resetAIResults();
      resetExecution();

      setLoading(true);
      setMessage(LOADING_MESSAGES.TEST_CASES);

      const response = await generateTestCases(
        requirement,
        testingTypes,
        designTechniques,
        images,
        provider
      );

      console.log("AI Response:", response);

      if (typeof response.result === "string") {
        setMessage("⚠️ " + response.result);
        return;
      }

      setResult(response.result);

      setMessage("");

      toast.success(SUCCESS_MESSAGES.TEST_CASES);

    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Unknown Error");
      }
    } finally {
      setLoading(false);
    }
  }

  //==================================
  // HANDLE AI RECOMMEND REVIEW:
  //==================================
  const handleRecommend = async () => {

    if (!result) {
      toast.error(VALIDATION_MESSAGES.TESTCASE_REQUIRED);
      return;
    }

    try {
      setLoading(true);
      setMessage(LOADING_MESSAGES.REVIEW);

      const response = await generateReview(result, provider);
      console.log("Review Response:", response);

      // Gemini returned an error
      if (typeof response.result === "string") {
        setMessage("⚠️ " + response.result);
        return;
      }

      setReview(response.result);
      setMessage("")

      toast.success(SUCCESS_MESSAGES.REVIEW);

    } catch (error) {

      console.error(error);

      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(ERROR_MESSAGES.REVIEW);
      }
    }
    finally {

      setLoading(false);

    }

  };

  //==================================
  // HANDLE GENERATE PLAYWRIGHT:
  //==================================
  const handleGeneratePlaywright = async () => {

    try {
      resetExecution();

      setLoading(true);
      setMessage(LOADING_MESSAGES.PLAYWRIGHT);

      const response = await generatePlaywright(requirement, result, provider);
      console.log("Playwright Response:", response);

      if (typeof response.result === "string") {
        setMessage("⚠️ " + response.result);
        return;
      }

      setPlaywrightCode(response.result.code);
      setMessage("");

      toast.success(SUCCESS_MESSAGES.PLAYWRIGHT);

    } catch (error) {

      console.error(error);

      if (error instanceof Error) {
        toast.error(error.message);
      } else {

        toast.error(ERROR_MESSAGES.PLAYWRIGHT);
      }
    } finally {

      setLoading(false);

    }

  };

  //==================================
  // HANDLE GENERATE SQL:
  //==================================
  const handleGenerateSQL = async () => {

    try {

      setLoading(true);
      setMessage(LOADING_MESSAGES.SQL);

      const response = await generateSQL(
        requirement,
        result,
        provider
      );

      if (typeof response.result === "string") {
        setMessage("⚠️ " + response.result);
        return;
      }

      setSqlCode(response.result.sql);

      setMessage("");

      toast.success(SUCCESS_MESSAGES.SQL);

    } catch (error) {

      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(ERROR_MESSAGES.SQL);
      }

    } finally {

      setLoading(false);

    }

  };

  //==================================
  // HANDLE RUN AUTOMATION:
  //==================================
  const handleRunAutomation = async () => {

    if (!playwrightCode) {
      toast.error(VALIDATION_MESSAGES.PLAYWRIGHT_REQUIRED);
      return;
    }

    try {
      resetExecution();

      setLoading(true);
      setMessage(LOADING_MESSAGES.AUTOMATION);

      const response = await runAutomation(playwrightCode);

      console.log(response);

      setExecution(response.summary);

      setStdout(response.stdout);

      setStderr(response.stderr);

      if (response.success) {
        toast.success(SUCCESS_MESSAGES.AUTOMATION);
      } else {
        toast.error("Automation failed. Check the Allure report for details.");
      }
      setMessage("");

    } catch (error) {

      console.error(error);

      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(ERROR_MESSAGES.AUTOMATION);
      }

    } finally {

      setLoading(false);

    }
  };

  //==================================
  // HANDLE VIEW REPORT:
  //==================================
  const handleViewReport = () => {

    window.open(
      "https://ai-qa-studio.onrender.com/allure-report/index.html",
      "_blank"
    );

  };

  //==================================
  // HANDLE GENERATE BUG REPORT:
  //==================================
  const handleGenerateBugReport = async () => {

    if (!result && !requirement.trim()) {
      toast.error(VALIDATION_MESSAGES.BUGREPORT_REQUIRED);
      return;
    }
    try {

      setLoading(true);
      setMessage(LOADING_MESSAGES.BUG_REPORT);

      let response;

      if (result) {
        // Generate from existing test cases
        response = await generateBugReport( result, provider
        );
      } else {
        // Generate directly from requirement
        response = await generateBugReport(requirement, provider);
      }

      console.log(response);

      if (typeof response.result === "string") {
        setMessage(response.result);
        return;
      }

      setBugReport(response.result);
      setMessage("");

      toast.success(SUCCESS_MESSAGES.BUG_REPORT);

    } catch (error) {

      console.error(error);

      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(ERROR_MESSAGES.BUG_REPORT);
      }

    } finally {

      setLoading(false);

    }

  };

  //==================================
  // HANDLE EXPORT EXCEL:
  //==================================
  const handleExportExcel = async () => {
    if (!result) {
      toast.error(VALIDATION_MESSAGES.TESTCASE_REQUIRED);
      return;
    }

    try {
      await exportExcel(result);
      toast.success(SUCCESS_MESSAGES.EXCEL_EXPORT);
    } catch (error) {
      console.error(error);
      toast.error(ERROR_MESSAGES.EXCEL_EXPORT);
    }
  };

  //==================================
  // HANDLE EXPORT PDF:
  //==================================
  const handleExportPDF = async () => {

    if (!result) {
      toast.error(VALIDATION_MESSAGES.TESTCASE_REQUIRED);
      return;
    }

    try {

      await exportPdf(result);

      toast.success(SUCCESS_MESSAGES.PDF_EXPORT);

    } catch {

      toast.error(ERROR_MESSAGES.PDF_EXPORT);
    }
  };

  //==================================
  // HANDLE COPY TEST CASES:
  //==================================
  function handleCopyTestCases() {

    if (!result) {
      toast.error(ERROR_MESSAGES.COPY);
      return;
    }

    let text = "";

    result.testCases.forEach((tc: any) => {

      text += `====================================\n`;
      text += `${tc.testCaseId}\n`;
      text += `====================================\n\n`;

      text += `Category : ${tc.category}\n`;
      text += `Priority : ${tc.priority}\n\n`;

      text += `Scenario:\n${tc.scenario}\n\n`;

      text += `Expected Result:\n${tc.expectedResult}\n\n`;
    });

    navigator.clipboard.writeText(text);

    toast.success(SUCCESS_MESSAGES.COPY_TESTCASES);
  }

  //==================================
  // HANDLE COPY JSON FORMAT TEST CASES:
  //==================================
  function handleCopyJson() {

    if (!result) {
      toast.error(ERROR_MESSAGES.COPY);
      return;
    }

    navigator.clipboard.writeText(
      JSON.stringify(result, null, 2)
    );

    toast.success(SUCCESS_MESSAGES.COPY_JSON);
  }

  //==================================
  // HANDLE CLEAR FUNCTION:
  //==================================
  function handleClear() {
    setRequirement("");
    setTestingTypes([]);
    setDesignTechniques([]);
    setImages([]);

    setResult(null);

    resetAIResults();
    resetExecution();

    clearLoadingMessage();
  }


  return (
    <div className="min-h-screen bg-slate-100">
      <Header provider={provider}
        setProvider={setProvider}
      />

      <main className="max-w-7xl mx-auto p-6 space-y-6">

        <RequirementInput
          requirement={requirement}
          setRequirement={setRequirement}
          images={images}
          setImages={setImages}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <TestingTypes
            testingTypes={testingTypes}
            setTestingTypes={setTestingTypes}
          />

          <DesignTechniques
            designTechniques={designTechniques}
            setDesignTechniques={setDesignTechniques}
          />

        </div>


        <ActionButtons
          onRecommend={handleRecommend}
          onGenerateTestCases={handleGenerateTestCases}
          onGeneratePlaywright={handleGeneratePlaywright}
          onGenerateBugReport={handleGenerateBugReport}

          onRunAutomation={handleRunAutomation}
          onGenerateSQL={handleGenerateSQL}
          onViewReport={handleViewReport}

          onExportExcel={handleExportExcel}
          onExportPDF={handleExportPDF}

          onCopyTestCases={handleCopyTestCases}
          onCopyJson={handleCopyJson}

          onClear={handleClear}
        />

        <ExecutionSummary execution={execution} />
        {stdout && (
          <details className="bg-white rounded-xl shadow-md p-4">
            <summary className="cursor-pointer font-semibold">
              📄 Show Console Logs
            </summary>

            <pre className="mt-4 bg-slate-900 text-green-300 rounded-lg p-4 text-xs overflow-auto max-h-96 whitespace-pre-wrap">
              {stdout}
              {stderr}
            </pre>
          </details>
        )}

        {loading && (
          <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-4 text-yellow-800">
            {message}
          </div>
        )}

        {!loading && message && (
          <div className="rounded-lg border border-blue-300 bg-blue-50 p-4 text-blue-800">
            {message}
          </div>
        )}

        <Results result={result} />

        <SQLResult sql={sqlCode} />

        <PlaywrightResult
          code={playwrightCode}
        />
        <ReviewResult review={review} />
        <BugReportResult bugReport={bugReport} />
      </main>

      <Footer />

    </div>
  );
}

export default App;