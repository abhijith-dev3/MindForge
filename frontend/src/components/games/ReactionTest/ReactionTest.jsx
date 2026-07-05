import { useEffect, useRef, useState } from "react";
import { useGame } from "../../../context/GameContext";
import { saveScore } from "../../../services/scoreService";
import { sounds } from "../../../utils/soundManager";

const TOTAL_ROUNDS = 5;

export default function ReactionTest() {
  const [state, setState] = useState("idle");
  const [message, setMessage] = useState("Click start to begin");
  const [scores, setScores] = useState([]);
  const [round, setRound] = useState(1);
  const [countdown, setCountdown] = useState(null);
  const [avgTime, setAvgTime] = useState(null);
  const startTime = useRef(null);
  const waitTimeoutRef = useRef(null);
  const { bestScores, updateBestScore, incrementGamesPlayed } = useGame();

  const startRound = () => {
    clearTimeout(waitTimeoutRef.current);
  
    setState("countdown");
    setMessage("Get ready...");
    setCountdown(3);

    let count = 3;
    const interval = setInterval(() => {
      count -= 1;
      if (count === 0) {
        clearInterval(interval);
        setCountdown(null);
        setState("waiting");
        setMessage("Wait for green...");
        const delay = Math.floor(Math.random() * 3000) + 1500;
        waitTimeoutRef.current = setTimeout(() => {
          setState("ready"); 
          setMessage("CLICK NOW!");
          sounds.go();
          startTime.current = Date.now();
        }, delay);
      } else {
        setCountdown(count);
        sounds.countdownTick();
      }
    }, 1000);
  };

  const startGame = () => {
   setScores([]);
   setRound(1);
   setAvgTime(null);
   startRound();

  }
  const resetGame = () => {
    clearTimeout(waitTimeoutRef.current);
    setState("idle");
    setScores([]);
    setRound(1);
    setAvgTime(null);
    setMessage("Click start to begin");
    setCountdown(null);
  };

  const handleClick = () => {
    if (state === "waiting") {
      clearTimeout(waitTimeoutRef.current);
      sounds.tooSoon();
      setMessage("Too soon! Click Start to try again.");
      setState("idle");
      return;
    }
    if (state !== "ready") return;

    const reactionTime = Date.now() - startTime.current;
    const newScores = [...scores, reactionTime];
    setScores(newScores);
    updateBestScore("reaction", reactionTime, "lower");

    if (round < TOTAL_ROUNDS) {
      sounds.reactionRound();
      setMessage(`Round ${round}: ${reactionTime}ms`);
      setRound((prev) => prev + 1);
      setTimeout(() => {
        startRound();
      },1000)
      
    } else {
      const avg = Math.round(newScores.reduce((a, b) => a + b, 0) / newScores.length);
      setAvgTime(avg);
      setMessage(`Game Over! Avg: ${avg}ms`);
      setState("finished");
      incrementGamesPlayed();
      sounds.reactionGameOver();

     
      saveScore("reaction", avg, { best: Math.min(...newScores), rounds: newScores });
    }
  };

  useEffect(() => {
    return () => clearTimeout(waitTimeoutRef.current);
  }, []);

  const localBest = scores.length ? Math.min(...scores) : 0;

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">Reflex Training</p>
            <h1 className="mt-2 text-3xl font-black text-white">Reaction Test</h1>
            <p className="mt-3 text-slate-300">Wait for green, click instantly, and complete 5 rounds.</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Rounds</p>
              <p className="mt-2 text-2xl font-black text-white">{round}/{TOTAL_ROUNDS}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Local Best</p>
              <p className="mt-2 text-2xl font-black text-white">{localBest ? `${localBest}ms` : "--"}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Global Best</p>
              <p className="mt-2 text-2xl font-black text-white">{bestScores.reaction ? `${bestScores.reaction}ms` : "--"}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Average</p>
              <p className="mt-2 text-2xl font-black text-white">{avgTime ? `${avgTime}ms` : "--"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col items-center gap-6">
          <div
            onClick={handleClick}
            className={`flex h-[250px] w-full max-w-2xl items-center justify-center rounded-[2rem] text-center text-xl font-bold transition-all duration-300 sm:h-[300px] cursor-pointer select-none ${
              state === "idle" ? "bg-slate-800 text-slate-200"
              : state === "countdown" ? "bg-violet-600 text-white animate-pulse"
              : state === "waiting" ? "bg-rose-500 text-white"
              : state === "ready" ? "bg-emerald-500 text-white animate-pulse"
              : "bg-slate-900 text-slate-200"
            }`}
          >
            {countdown !== null ? <span className="text-6xl font-black">{countdown}</span> : message}
          </div>

          {state === "idle" && (
            <button onClick={startGame} className="rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300">
              Start
            </button>
          )}
          {state === "finished" && (
            <button onClick={resetGame} className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-semibold text-white transition hover:bg-white/10">
              Play Again
            </button>
          )}
        </div>
      </div>
    </section>
  );
}