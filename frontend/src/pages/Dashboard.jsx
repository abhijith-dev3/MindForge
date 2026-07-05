import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";

const games = [
  {
    name: "Memory Game",
    path: "/memory",
    color: "from-violet-600/30 to-fuchsia-600/10",
    desc: "Test your memory power with a growing sequence challenge.",
  },
  {
    name: "Reaction Test",
    path: "/reaction",
    color: "from-sky-600/30 to-cyan-600/10",
    desc: "Measure how fast you react when the signal appears.",
  },
  {
    name: "Accuracy Game",
    path: "/accuracy",
    color: "from-emerald-600/30 to-lime-600/10",
    desc: "Improve precision by clicking targets as fast as possible.",
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { bestScores, totalGamesPlayed, resetStats } = useGame();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [error, setError] = useState(null);

  const handleConfirmReset = async () => {
    setIsResetting(true);
    setError(null);
    try {
      await resetStats();
      setShowConfirm(false);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <section className="space-y-8">

      {/* confirmation modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/20">
                <span className="text-xl">⚠️</span>
              </div>
              <h2 className="text-lg font-bold text-white">Reset all stats?</h2>
            </div>

            <p className="mb-3 text-sm leading-relaxed text-slate-300">
              This permanently deletes your records from the database — not just this screen. You'll lose:
            </p>

            <ul className="mb-3 list-disc space-y-1 pl-5 text-sm text-slate-400">
              <li>Best reaction time</li>
              <li>Best memory score</li>
              <li>Best accuracy score</li>
              <li>Total games played</li>
            </ul>

            <div className="mb-5 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
              🗄️ This action cannot be undone.
            </div>

            {error && (
              <p className="mb-3 text-sm text-red-400">{error}</p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isResetting}
                className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReset}
                disabled={isResetting}
                className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-semibold text-white transition hover:bg-red-400 disabled:opacity-50"
              >
                {isResetting ? "Resetting…" : "Yes, reset everything"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">Dashboard</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-white">Your training center</h1>
          <p className="mt-4 max-w-2xl text-slate-300">
            Launch games, monitor your best scores, and keep your brain training progress in one polished place.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/games")}
              className="rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              View Games
            </button>
            <button
              onClick={() => setShowConfirm(true)}
              className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Reset Stats
            </button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-slate-400">Games Played</p>
            <p className="mt-2 text-3xl font-black text-white">{totalGamesPlayed}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-slate-400">Reaction Best</p>
            <p className="mt-2 text-3xl font-black text-white">{bestScores.reaction ? `${bestScores.reaction}ms` : "--"}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-slate-400">Memory Best</p>
            <p className="mt-2 text-3xl font-black text-white">{bestScores.memory || "--"}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-slate-400">Accuracy Best</p>
            <p className="mt-2 text-3xl font-black text-white">{bestScores.accuracy ? `${bestScores.accuracy}ms` : "--"}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {games.map((game) => (
          <div
            key={game.name}
            onClick={() => navigate(game.path)}
            className={`cursor-pointer rounded-3xl border border-white/10 bg-gradient-to-br ${game.color} p-6 shadow-xl transition duration-300 hover:-translate-y-2 hover:shadow-2xl`}
          >
            <h2 className="text-2xl font-black text-white">{game.name}</h2>
            <p className="mt-3 text-slate-200/90">{game.desc}</p>
            <p className="mt-6 text-sm font-semibold text-cyan-200">Click to start →</p>
          </div>
        ))}
      </div>
    </section>
  );
}