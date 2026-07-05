import express from "express";
import { createScore, getLeaderboard, getMyScores, resetMyScores } from "../controllers/scoreController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createScore);
router.get("/me", authMiddleware, getMyScores);
router.get("/leaderboard/:game", getLeaderboard);
router.delete("/reset", authMiddleware, resetMyScores); // ← add this

export default router;