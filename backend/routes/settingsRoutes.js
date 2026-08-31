import express from "express";

import {
  getSettings,
  updateSettings,
  deleteAccount,
} from "../controllers/settingsController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get current user's settings
router.get("/", protect, getSettings);

// Update current user's settings
router.put("/", protect, updateSettings);

// Delete current user's account
router.delete("/account", protect, deleteAccount);

export default router;