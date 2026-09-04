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

// ============================================================
// ENVIRONMENT CHECK
// ============================================================

console.log(
  "OpenAI key loaded:",
  process.env.OPENAI_API_KEY ? "YES ✅" : "NO ❌"
);

// ============================================================
// DATABASE
// ============================================================

connectDB();

// ============================================================
// MIDDLEWARE
// ============================================================

const allowedOrigins = [
  "http://localhost:5173",
  "https://femora-webapp.vercel.app",
  
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
// ============================================================
// API ROUTES
// ============================================================

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

// ============================================================
// ROOT ROUTE
// ============================================================

app.get("/", (req, res) => {
  res.send("Femora Backend is working 🚀");
});

// ============================================================
// VERCEL EXPORT
// ============================================================

export default app;