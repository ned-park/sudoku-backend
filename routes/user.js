import express from "express";
const router = express.Router({ mergeParams: true });
import userController from "../controllers/users.js";
import { requireAuth } from "../middleware/requireAuth.js";

router.post("/login", userController.login);
router.post("/signup", userController.signup);
router.put("/changeusername", requireAuth, userController.changeUsername);

export default router;
