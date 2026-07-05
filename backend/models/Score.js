import mongoose from "mongoose";

const scoreSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    game: {
      type: String,
      enum: ["reaction", "memory", "accuracy"],
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    meta: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

scoreSchema.index({ game: 1, score: -1 });
scoreSchema.index({ user: 1, game: 1 });

const Score = mongoose.model("Score", scoreSchema);
export default Score;