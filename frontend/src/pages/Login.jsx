import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.14),_transparent_30%),radial-gradient(circle_at_right,_rgba(168,85,247,0.12),_transparent_24%)]" />

      <div className="relative z-10 w-full max-w-md">
        <Link
          to="/login"
          className="flex items-center gap-3 justify-center mb-8"
        >
          <div className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/5">
            <span className="text-xl">🎮</span>
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-cyan-300">
              MindForge
            </h1>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
              Brain training
            </p>
          </div>
        </Link>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
          <h2 className="text-2xl font-black text-white mb-1">Welcome back</h2>
          <p className="text-slate-400 text-sm mb-6">
            Sign in to continue training
          </p>

          {error && (
            <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
              {error}
            </div>
          )}

          {/* FORM tag is critical for Enter key and proper submit */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-slate-500 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white placeholder-slate-600 outline-none ring-cyan-400/50 transition focus:border-cyan-400/50 focus:ring-2"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-slate-500 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white placeholder-slate-600 outline-none ring-cyan-400/50 transition focus:border-cyan-400/50 focus:ring-2"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-cyan-400 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-cyan-400 hover:text-cyan-300"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
