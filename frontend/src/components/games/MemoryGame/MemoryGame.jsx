import { useRef, useState } from "react";
import { useGame } from "../../../context/GameContext";
import { saveScore } from "../../../services/scoreService";

const COLORS = ["red", "blue", "green", "yellow"];
const MAX_ROUNDS = 15;
const COLOR_CLASSES = {
  red: "from-rose-500 to-red-600",
  blue: "from-sky-500 to-blue-600",
  green: "from-emerald-500 to-green-600",
  yellow: "from-amber-300 to-yellow-500",
};

export default function MemoryGame() {
  const [message, setMessage] = useState("Press Start to play");
  const [round, setRound] = useState(0);
  const [best, setBest] = useState(0);
  const [litColor, setLitColor] = useState(null);
  const [canClick, setCanClick] = useState(false);
  const [started, setStarted] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const sequenceRef = useRef([]);
  const userInputRef = useRef([]);
  const playingRef = useRef(false);
  const { bestScores, updateBestScore, incrementGamesPlayed } = useGame();

  const flashColor = (color, cb) => {
    setLitColor(color);
    setTimeout(() => {
      setLitColor(null);
      if (cb) setTimeout(cb, 200);
    }, 350);
  };

  const showSequence = (seq) => {
    setCanClick(false);
    setMessage("Watch...");
    let i = 0;
    const next = () => {
      if (i >= seq.length) {
        setMessage("Your turn!");
        setCanClick(true);
        return;
      }
      flashColor(seq[i], () => { i += 1; next(); });
    };
    setTimeout(next, 400);
  };




  const addRound = () => {
    userInputRef.current = [];
    const next = COLORS[Math.floor(Math.random() * COLORS.length)];
    const newSeq = [...sequenceRef.current, next];
    sequenceRef.current = newSeq;
    setRound(newSeq.length);
    setBest((prev) => Math.max(prev, newSeq.length));
    showSequence(newSeq);
  };




  const startGame = () => {
    sequenceRef.current = [];
    userInputRef.current = [];
    playingRef.current = true;
    setRound(0);
    setStarted(true);
    setMessage("Get ready...");
    setCountdown(3);

    let count = 3;
    const interval = setInterval(() => {
      count -= 1;
      if (count === 0) {
        clearInterval(interval);
        setCountdown(null);
        setMessage("Go!");
        setTimeout(addRound, 500);
      } else {
        setCountdown(count);
      }
    }, 1000);
  };

  const gameOver = (won = false) => {
    playingRef.current = false;
    setCanClick(false);
    const finalRound = sequenceRef.current.length;

    if (won) {
      setMessage("🎉 You won! All 15 rounds complete!");
    } else {
      setMessage(`Game over! You reached round ${finalRound}`);
    }

    incrementGamesPlayed();
    updateBestScore("memory", finalRound, "higher");


    saveScore("memory", finalRound, { won });
  };



  
  const handleClick = (color) => {
    if (!canClick || !playingRef.current) return;

    flashColor(color);
    const input = [...userInputRef.current, color];
    userInputRef.current = input;
    const idx = input.length - 1;

    if (input[idx] !== sequenceRef.current[idx]) {
      gameOver(false);
      return;
    }

    if (input.length === sequenceRef.current.length) {
      setCanClick(false);
      if (sequenceRef.current.length >= MAX_ROUNDS) {
        gameOver(true);
        return;
      }
      setMessage("Correct! Next round...");
      setTimeout(addRound, 1000);
    }
  };

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-violet-300">Memory Sequence</p>
            <h1 className="mt-2 text-3xl font-black text-white">Memory Game</h1>
            <p className="mt-3 text-slate-300">Repeat the shown pattern and survive all 15 rounds.</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Round</p>
              <p className="mt-2 text-2xl font-black text-white">{round}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Best</p>
              <p className="mt-2 text-2xl font-black text-white">{best}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 col-span-2">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Global Best</p>
              <p className="mt-2 text-2xl font-black text-white">{bestScores.memory || 0}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col items-center gap-6 py-4">
          <p className="min-h-[28px] text-center text-lg text-slate-300">{message}</p>
          <div className="grid grid-cols-2 gap-4">
            {COLORS.map((color) => (
              <button
                key={color}
                onClick={() => handleClick(color)}
                disabled={!canClick}
                aria-label={color}
                className={`h-28 w-28 rounded-[1.75rem] bg-gradient-to-br transition-all duration-150 sm:h-32 sm:w-32 ${COLOR_CLASSES[color]} ${
                  litColor === color ? "scale-105 brightness-125 ring-4 ring-white/80" : "opacity-90"
                } ${!canClick ? "cursor-not-allowed" : "active:scale-95"}`}
              />
            ))}
          </div>
          <button onClick={startGame} className="rounded-xl bg-cyan-400 px-8 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300">
            {started ? "Restart" : "Start Game"}
          </button>
          {countdown !== null && <div className="text-6xl font-black text-cyan-300">{countdown}</div>}
        </div>
      </div>
    </section>
  );
}
