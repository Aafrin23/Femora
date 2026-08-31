import express from "express";

import {
  createInspiration,
  getInspirations,
  getMyInspirations,
  toggleInspire,
  deleteInspiration,
} from "../controllers/inspirationController.js";

import {protect} from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all inspiration posts
router.get("/", protect, getInspirations);

// Get logged-in user's posts
router.get("/my", protect, getMyInspirations);

// Create achievement
router.post("/", protect, createInspiration);

// Inspire / Uninspire
router.put("/:id/inspire", protect, toggleInspire);

// Delete achievement
router.delete("/:id", protect, deleteInspiration);

export default router;