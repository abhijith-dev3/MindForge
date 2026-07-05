import API from "./api";

// Call this when a game ends
export const saveScore = async (game, score, meta = {}) => {
  try {
    const res = await API.post("/scores", { game, score, meta });
    return res.data;
  } catch (err) {
    console.error("Failed to save score:", err.message);
  }
};

export const getMyScores = async () => {
  const res = await API.get("/scores/me");
  return res.data;
};

export const getLeaderboard = async (game) => {
  const res = await API.get(`/scores/leaderboard/${game}`);
  return res.data;
};