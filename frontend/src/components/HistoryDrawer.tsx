import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getUserHistoryList, loadUserHistoryItem, deleteUserHistoryItem } from "../services/api";

interface HistoryItem {
    filename: string;
    formattedDate: string;
    requirementTitle: string;
    testCaseCount: number;
    hasPlaywright: boolean;
    hasSQL: boolean;
    hasBugReport: boolean;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    username: string;
    onLoadSession: (sessionData: any) => void;
}

export default function HistoryDrawer({ isOpen, onClose, username, onLoadSession }: Props) {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && username) {
            fetchHistory();
        }
    }, [isOpen, username]);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const res = await getUserHistoryList(username);
            if (res && res.history) {
                setHistory(res.history);
            }
        } catch (err: any) {
            toast.error(err.message || "Failed to load history list.");
        } finally {
            setLoading(false);
        }
    };

    const handleLoadItem = async (filename: string) => {
        try {
            const res = await loadUserHistoryItem(username, filename);
            if (res && res.data) {
                onLoadSession(res.data);
                toast.success("Restored saved test session!");
                onClose();
            }
        } catch (err: any) {
            toast.error(err.message || "Failed to load session.");
        }
    };

    const handleDeleteItem = async (filename: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm("Are you sure you want to delete this saved session?")) return;

        try {
            await deleteUserHistoryItem(username, filename);
            setHistory((prev) => prev.filter((item) => item.filename !== filename));
            toast.success("Saved session deleted.");
        } catch (err: any) {
            toast.error(err.message || "Failed to delete session.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm">
            <div className="bg-white w-full max-w-lg h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 animate-slideLeft">
                
                {/* Header */}
                <div className="px-6 py-5 border-b bg-gradient-to-r from-slate-900 to-indigo-900 text-white flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            📜 My Saved History
                        </h2>
                        <p className="text-xs text-blue-200 mt-1">
                            Private test sessions for <span className="font-semibold text-white">@{username}</span>
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white/80 hover:text-white text-2xl font-bold px-2 py-1 rounded-lg hover:bg-white/10 transition"
                    >
                        ✕
                    </button>
                </div>

                {/* History List */}
                <div className="p-6 overflow-y-auto flex-1 space-y-4">
                    {loading ? (
                        <div className="text-center py-12 text-slate-500 font-medium animate-pulse">
                            Loading your saved history...
                        </div>
                    ) : history.length === 0 ? (
                        <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-8">
                            <div className="text-4xl mb-3">📭</div>
                            <h3 className="text-base font-bold text-slate-700">No Saved History Yet</h3>
                            <p className="text-xs text-slate-500 mt-1">
                                Generate test cases or scripts while logged in to automatically save history entries here.
                            </p>
                        </div>
                    ) : (
                        history.map((item) => (
                            <div
                                key={item.filename}
                                onClick={() => handleLoadItem(item.filename)}
                                className="bg-white rounded-2xl border border-slate-200 hover:border-blue-400 p-5 shadow-sm hover:shadow-md transition cursor-pointer group relative"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h3 className="font-bold text-slate-800 text-base group-hover:text-blue-600 transition">
                                            {item.requirementTitle}
                                        </h3>
                                        <p className="text-xs text-slate-500 mt-1 font-medium">
                                            🕒 {item.formattedDate}
                                        </p>
                                    </div>
                                    <button
                                        onClick={(e) => handleDeleteItem(item.filename, e)}
                                        className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition text-sm"
                                        title="Delete Session"
                                    >
                                        🗑️
                                    </button>
                                </div>

                                <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-slate-100">
                                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                                        🧪 {item.testCaseCount} Test Cases
                                    </span>
                                    {item.hasPlaywright && (
                                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                                            🎭 Playwright
                                        </span>
                                    )}
                                    {item.hasSQL && (
                                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                            🗄️ SQL
                                        </span>
                                    )}
                                    {item.hasBugReport && (
                                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                                            🐞 Bug Report
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t bg-slate-50 text-center text-xs text-slate-500">
                    Click any session above to load it directly onto your dashboard.
                </div>
            </div>
        </div>
    );
}
