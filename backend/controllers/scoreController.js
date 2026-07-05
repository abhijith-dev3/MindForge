import Score from "../models/Score.js";

export const createScore = async (req, res) => {
  const { game, score, meta } = req.body;

  if (!game || score === undefined) {
    res.status(400);
    throw new Error("Game and score are required");
  }

  

  const newScore = await Score.create({
    user: req.user._id,
    game,
    score,
    meta: meta || {},
  });

  res.status(201).json(newScore);
};



export const getMyScores = async (req, res) => {
  const scores = await Score.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(scores);
};




export const getLeaderboard = async (req, res) => {
  const { game } = req.params;

  const scores = await Score.find({ game })
    .populate("user", "name email")
    .sort({ score: -1 })
    .limit(10);

  res.json(scores);
};




export const resetMyScores = async (req, res) => {
  try {
    await Score.deleteMany({ user: req.user._id });
    res.json({ message: "Stats reset successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to reset stats" });
  }
};