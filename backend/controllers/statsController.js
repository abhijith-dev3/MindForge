import Score from "../models/Score.js";


const LOWER_IS_BETTER = ["reaction", "accuracy"];

export const getDashboardStats = async (req, res) => {
  const scores = await Score.find({ user: req.user._id }).sort({ createdAt: -1 });

  const totalGamesPlayed = scores.length;

  const bestScores = { reaction: null, memory: null, accuracy: null };

  scores.forEach(({ game, score }) => {
    const current = bestScores[game];
    if (current === null) {
      bestScores[game] = score;
    } else if (LOWER_IS_BETTER.includes(game)) {
      if (score < current) bestScores[game] = score;
    } else {
      if (score > current) bestScores[game] = score;
    }
  });

  res.json({
    totalGamesPlayed,
    bestScores,
    recentScores: scores.slice(0, 5),
  });
};