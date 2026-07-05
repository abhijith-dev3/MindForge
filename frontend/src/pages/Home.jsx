import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="grid min-h-[calc(100vh-120px)] items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div>
        <p className="mb-4 inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">
          Premium Mind Training
        </p>
        <h1 className="text-5xl font-black tracking-tight text-white sm:text-6xl">
          Train faster. Think sharper. Play better.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
          MindForge is a responsive mini-game platform designed to improve
          memory, reaction speed, and click accuracy with a cleaner and more
          professional experience.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="rounded-xl bg-cyan-400 px-8 py-3 text-lg font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                Enter Dashboard
              </Link>
              <Link
                to="/games"
                className="rounded-xl border border-white/10 bg-white/5 px-8 py-3 text-lg font-semibold text-white transition hover:bg-white/10"
              >
                Browse Games
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/register"
                className="rounded-xl bg-cyan-400 px-8 py-3 text-lg font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="rounded-xl border border-white/10 bg-white/5 px-8 py-3 text-lg font-semibold text-white transition hover:bg-white/10"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
            <p className="text-sm text-slate-400">Game Modes</p>
            <p className="mt-2 text-3xl font-black text-white">3</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
            <p className="text-sm text-slate-400">Brain Training</p>
            <p className="mt-2 text-3xl font-black text-white">Track Your Progress</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 sm:col-span-2">
            <p className="text-sm text-slate-400">Challenge Yourself</p>
            <p className="mt-2 text-xl font-bold text-white">
              Every click counts. Improve your reaction time, memory, and
              precision one game at a time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
