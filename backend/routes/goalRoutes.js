import express from "express";

import {
  getGoals,
  getGoal,
  createGoal,
  updateGoal,
  deleteGoal,
} from "../controllers/goalController.js";

import {protect} from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all goals
router.get("/", protect, getGoals);

// Get one goal
router.get("/:id", protect, getGoal);

// Create goal
router.post("/", protect, createGoal);

// Update goal
router.put("/:id", protect, updateGoal);

// Delete goal
router.delete("/:id", protect, deleteGoal);

export default router;