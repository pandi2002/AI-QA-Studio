import { Component } from "react";
import type { ReactNode, ErrorInfo } from "react";

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  private handleResetSession = () => {
    try {
      localStorage.removeItem("ai_qa_active_workspace");
    } catch {}
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="my-6 p-6 rounded-2xl bg-red-50 border border-red-200 shadow-sm text-slate-800">
          <div className="flex items-center gap-3 text-red-600 font-bold text-xl mb-2">
            <span>⚠️</span>
            <h3>{this.props.fallbackTitle || "Render Error Encountered"}</h3>
          </div>
          <p className="text-sm text-slate-600 mb-4">
            A rendering error occurred due to malformed data. You can clear the cached workspace or retry.
          </p>
          {this.state.error?.message && (
            <div className="bg-white p-3 rounded-lg border border-red-100 font-mono text-xs text-red-700 mb-4 overflow-x-auto">
              {this.state.error.message}
            </div>
          )}
          <div className="flex gap-3">
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-sm font-semibold transition"
            >
              Try Again
            </button>
            <button
              onClick={this.handleResetSession}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition"
            >
              Reset Session & Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
