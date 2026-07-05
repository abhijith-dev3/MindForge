import { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "mindforge-stats";
const GameContext = createContext(null);

const defaultState = {
  bestScores: {
    reaction: 0,
    memory: 0,
    accuracy: 0,
  },
  totalGamesPlayed: 0,
};

export function GameProvider({ children }) {
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultState;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  }, [stats]);

  const updateBestScore = (game, score, mode = "lower") => {
    setStats((prev) => {
      const current = prev.bestScores[game];
      const shouldUpdate = current === 0 || (mode === "lower" ? score < current : score > current);
      return {
        ...prev,
        bestScores: {
          ...prev.bestScores,
          [game]: shouldUpdate ? score : current,
        },
      };
    });
  };

  const incrementGamesPlayed = () => {
    setStats((prev) => ({ ...prev, totalGamesPlayed: prev.totalGamesPlayed + 1 }));
  };

  const resetStats = async () => {
    const token = localStorage.getItem("token"); // ✅ matches your AuthContext
    
   const res = await fetch("http://localhost:5000/api/scores/reset",{
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Failed to reset stats");
    }

    setStats(defaultState);
    localStorage.removeItem(STORAGE_KEY);
  };

  const value = useMemo(
    () => ({
      bestScores: stats.bestScores,
      totalGamesPlayed: stats.totalGamesPlayed,
      updateBestScore,
      incrementGamesPlayed,
      resetStats,
    }),
    [stats]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used inside GameProvider");
  return context;
}