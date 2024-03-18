import express from "express";
const router = express.Router({ mergeParams: true });
import Score from "../models/Score.js";
import User from "../models/User.js";

const scoreController = {
  getHighScores: async (req, res) => {
    try {
      let scores = await Score.getHighScores();
      res.status(200).json(scores);
    } catch (err) {
      console.error(err);
      res.status(500);
    }
  },
  addNewScore: async (req, res) => {
    try {
      const { score, userId } = req.body;
      if (!score) throw new Error("No score");
      let user,
        username = "Guest";
      if (req.user?.id) {
        user = await User.findOne({ _id: req.user.id });
        username = user.username;
      }

      const newScore = new Score({
        score,
        username,
      });

      const savedScore = await newScore.save();
      res.status(201).json({ message: "Success" });
    } catch (err) {
      let status = 500;
      if (err.message == "No score") {
        status = 422;
      } else {
        console.error(err);
      }

      res.status(status).json(err.message);
    }
  },
};

export default scoreController;
