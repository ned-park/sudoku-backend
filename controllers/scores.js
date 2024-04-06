import express from "express";
const router = express.Router({ mergeParams: true });
import Score from "../models/Score.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const scoreController = {
  getHighScores: async (req, res) => {
    const { authorization } = req.headers;

    try {
      let scores = await Score.getHighScores();
      const data = { scores };
      if (authorization) {
        const token = authorization.split(" ")[1];
        const { username, id } = jwt.verify(token, process.env.JWT_SECRET);
        if (!username) {
          res.status(200).json(data);
          return;
        }
        const userScores = await Score.find({ username: username });
        data.userScores = userScores;
      }
      res.status(200).json(data);
    } catch (err) {
      console.error(err);
      res.status(500);
    }
  },
  addNewScore: async (req, res) => {
    const { authorization } = req.headers;
    try {
      const { score } = req.body;
      if (!score) throw new Error("No score");
      let user,
        username = "Guest";
      if (authorization) {
        const token = authorization.split(" ")[1];
        const data = jwt.verify(token, process.env.JWT_SECRET);
        username = data.username;
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
