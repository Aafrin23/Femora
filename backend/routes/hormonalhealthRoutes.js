import express from "express";

import {
  getHormonalHealth,
  updateHormonalHealth,
} from "../controllers/hormonalhealthController.js";

import {protect} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getHormonalHealth);

router.put("/", protect, updateHormonalHealth);

export default router;