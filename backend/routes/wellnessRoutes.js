import express from "express";

import {
  getTodayWellness,
  updateHabit,
} from "../controllers/wellnessController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/today",
  protect,
  getTodayWellness
);

router.patch(
  "/habit",
  protect,
  updateHabit
);

export default router;