import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import wellnessRoutes from "./routes/wellnessRoutes.js";
import plannerRoutes from "./routes/PlannerRoutes.js";
import journalRoutes from "./routes/journalRoutes.js";
import goalRoutes from "./routes/goalRoutes.js";
import hormonalHealthRoutes from "./routes/hormonalhealthRoutes.js";
import communityRoutes from "./routes/communityRoutes.js";
import inspirationRoutes from "./routes/inspirationRoutes.js";
import learningRoutes from "./routes/learningRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
const app = express();
console.log(
  "OpenAI key loaded:",
  process.env.OPENAI_API_KEY ? "YES ✅" : "NO ❌"
);

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/wellness", wellnessRoutes);
app.use("/api/planner", plannerRoutes);
app.use("/api/journal", journalRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/hormonal-health", hormonalHealthRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/inspiration", inspirationRoutes);
app.use("/api/learning", learningRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/chat", chatRoutes);
app.get("/", (req, res) => {
  res.send("Backend is working 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});