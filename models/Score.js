import mongoose from "mongoose";
import User from "./User.js";

const ScoreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  date: {
    type: Date,
    default: Date.now(),
    required: false,
  },
  score: {
    type: Number,
    required: true,
  },
  username: {
    type: String,
    required: true,
    default: "Guest",
  },
});

ScoreSchema.statics.getHighScores = async function () {
  // const scores = await Score.aggregate([
  //   {
  //     $group: {
  //       score: { $min: "$result.score" },
  //     },
  //   },
  //   {
  //     $sort: { score: 1 },
  //   },
  //   {
  //     $limit: 10,
  //   },
  // ]);
  const scores = await Score.find({});
  // if (scores) console.log(scores);
  return scores;
};

ScoreSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.username = returnedObject.userId
      ? userId.username ?? false
      : returnedObject.username;
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.userId;
  },
});

const Score = mongoose.model("Score", ScoreSchema);
export default Score;
