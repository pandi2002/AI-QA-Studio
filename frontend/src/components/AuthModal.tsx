import { useState } from "react";
import toast from "react-hot-toast";
import { loginUser, registerUser } from "../services/api";
import type { User } from "../types/user";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onLoginSuccess: (user: User) => void;
}

export default function AuthModal({ isOpen, onClose, onLoginSuccess }: Props) {
    const [isRegister, setIsRegister] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim() || !password.trim()) {
            toast.error("Please enter both username and password.");
            return;
        }

        try {
            setLoading(true);
            let res;
            if (isRegister) {
                res = await registerUser(username, password, name);
                toast.success("Account created successfully!");
            } else {
                res = await loginUser(username, password);
                toast.success("Welcome back!");
            }

            if (res.user) {
                onLoginSuccess(res.user);
                onClose();
            }
        } catch (err: any) {
            toast.error(err.message || "Authentication failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 relative animate-fadeIn">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-xl font-bold"
                >
                    ✕
                </button>

                <h2 className="text-2xl font-bold text-slate-800 mb-1">
                    {isRegister ? "👤 Create Account" : "🔐 User Login"}
                </h2>
                <p className="text-sm text-slate-500 mb-6">
                    {isRegister
                        ? "Register to save your personalized test cases & reports"
                        : "Sign in to access your private test suite reports"}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {isRegister && (
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wider">
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your Name"
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wider">
                            Username
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="username (e.g. alex)"
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wider">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition shadow-md hover:shadow-lg disabled:opacity-50 mt-2"
                    >
                        {loading ? "Processing..." : isRegister ? "Create Account" : "Sign In"}
                    </button>
                </form>

                <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
                    {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
                    <button
                        onClick={() => setIsRegister(!isRegister)}
                        className="font-semibold text-blue-600 hover:underline ml-1"
                    >
                        {isRegister ? "Log In" : "Register Now"}
                    </button>
                </div>
            </div>
        </div>
    );
}
