// import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import { URL } from "url";
import { PORT, MONGO_URI } from "./config.js";

import userRoutes from "./routes/user.js";
import scoreRoutes from "./routes/score.js";

const __filename = new URL("", import.meta.url).pathname;
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

try {
  const conn = await mongoose.connect(MONGO_URI, {});

  console.log(`MongoDB Connected: ${conn.connection.host}`);
} catch (err) {
  console.error(err);
  process.exit(1);
} finally {
  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
}

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRoutes);
app.use("/api/score", scoreRoutes);

if (process.env.NODE_ENV === "production") {
  const htmlPath = path.join(path.join(__dirname, "client", "dist"));
  app.use(express.static(htmlPath));
}

export default app;
