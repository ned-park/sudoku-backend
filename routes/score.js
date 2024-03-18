import express from "express";
const router = express.Router({ mergeParams: true });
import scoreController from "../controllers/scores.js";

router.get("/", scoreController.getHighScores);
router.post("/", scoreController.addNewScore);

export default router;
