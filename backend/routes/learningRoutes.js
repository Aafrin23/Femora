import express from "express";

import {
  getLearningPosts,
  createLearningPost,
  deleteLearningPost,
  toggleLearningLike,
  toggleLearningSave,
  addLearningComment,
} from "../controllers/learningController.js";

import {protect} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getLearningPosts);

router.post("/", protect, createLearningPost);

router.delete("/:id", protect, deleteLearningPost);

router.put("/:id/like", protect, toggleLearningLike);

router.put("/:id/save", protect, toggleLearningSave);

router.post("/:id/comments", protect, addLearningComment);

export default router;