import express from "express";

import {
  registerUser,
  loginUser,
  getMyProfile,
  updateMyProfile,
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Authentication
router.post("/register", registerUser);
router.post("/login", loginUser);

// Profile
router.get("/profile", protect, getMyProfile);
router.put("/profile", protect, updateMyProfile);

export default router;