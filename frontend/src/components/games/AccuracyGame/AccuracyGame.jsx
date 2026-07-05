import { useEffect, useRef, useState } from "react";
import { useGame } from "../../../context/GameContext";
import { saveScore } from "../../../services/scoreService";

const MAX_ROUNDS = 10;
const BOARD_SIZE = 320;
const TARGET_SIZE = 44;

export default function AccuracyGame() {
  const [targetPos, setTargetPos] = useState(null);
  const [message, setMessage] = useState("Click Start");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [round, setRound] = useState(0);
  const [average, setAverage] = useState(0);
  const [results, setResults] = useState([]);
  const timeoutRef = useRef(null);
  const startTime = useRef(null);
  const { bestScores, updateBestScore, incrementGamesPlayed } = useGame();

  const spawnTarget = () => {
    const x = Math.random() * (BOARD_SIZE - TARGET_SIZE);
    const y = Math.random() * (BOARD_SIZE - TARGET_SIZE);
    setTargetPos({ x, y });
    startTime.current = Date.now();
  };

  const finishGame = (times) => {
    const avg = times.length
      ? Math.round(times.reduce((sum, t) => sum + t, 0) / times.length)
      : 0;
    setAverage(avg);
    setTargetPos(null);
    setMessage(`Game Over 🎯 Avg: ${avg}ms`);
    incrementGamesPlayed();
    if (avg) {
      updateBestScore("accuracy", avg, "lower");
  
      saveScore("accuracy", avg, { best: Math.min(...times), rounds: times });
    }
  };

  const startGame = () => {
    clearTimeout(timeoutRef.current);
    setScore(0);
    setBest(0);
    setRound(1);
    setAverage(0);
    setResults([]);
    setMessage("Click the target!");
    spawnTarget();
  };

  const handleClick = () => {
    const reactionTime = Date.now() - startTime.current;
    const updatedResults = [...results, reactionTime];
    setResults(updatedResults);
    setScore((prev) => prev + 1);
    setBest((prev) => (prev === 0 ? reactionTime : Math.min(prev, reactionTime)));
    setMessage(`Reaction: ${reactionTime}ms`);
    setTargetPos(null);

    if (round >= MAX_ROUNDS) {
      finishGame(updatedResults);
      return;
    }

    timeoutRef.current = setTimeout(() => {
      setRound((prev) => prev + 1);
      spawnTarget();
    }, 800);
  };

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-emerald-300">Precision Mode</p>
            <h1 className="mt-2 text-3xl font-black text-white">Accuracy Game</h1>
            <p className="mt-3 text-slate-300">Click every target quickly and keep your average reaction low.</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Score</p>
              <p className="mt-2 text-2xl font-black text-white">{score}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Round</p>
              <p className="mt-2 text-2xl font-black text-white">{round} / {MAX_ROUNDS}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Best Hit</p>
              <p className="mt-2 text-2xl font-black text-white">{best ? `${best}ms` : "--"}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Global Best</p>
              <p className="mt-2 text-2xl font-black text-white">{bestScores.accuracy ? `${bestScores.accuracy}ms` : "--"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col items-center gap-6">
          <p className="text-slate-300">{message}</p>
          <p className="text-sm text-slate-500">Average: {average ? `${average}ms` : "--"}</p>
          <div className="relative h-[320px] w-full max-w-[320px] rounded-[2rem] border border-white/10 bg-slate-900/80">
            <div className="absolute inset-4 rounded-[1.5rem] border border-dashed border-white/10" />
            {targetPos && (
              <button
                onClick={handleClick}
                aria-label="target"
                className="absolute h-11 w-11 rounded-full bg-gradient-to-br from-rose-400 to-orange-400 shadow-[0_12px_30px_rgba(244,63,94,0.4)] transition hover:scale-105 active:scale-95"
                style={{ left: targetPos.x, top: targetPos.y }}
              />
            )}
          </div>
          <button onClick={startGame} className="rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300">
            Start Game
          </button>
        </div>
      </div>
    </section>
  );
}
