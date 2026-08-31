import express from "express";

import {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  toggleLike,
  toggleSave,
  addComment,
  getComments,
  deleteComment,
} from "../controllers/communityController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ============================================================
// POSTS
// ============================================================

// Create post
router.post("/", protect, createPost);

// Get all public posts
router.get("/", protect, getPosts);

// Get single post
router.get("/:id", protect, getPost);

// Update own post
router.patch("/:id", protect, updatePost);

// Delete own post
router.delete("/:id", protect, deletePost);

// Like / unlike
router.post("/:id/like", protect, toggleLike);

// Save / unsave
router.post("/:id/save", protect, toggleSave);

// ============================================================
// COMMENTS
// ============================================================

// Add comment
router.post("/:id/comments", protect, addComment);

// Get comments
router.get("/:id/comments", protect, getComments);

// Delete own comment
router.delete(
  "/:id/comments/:commentId",
  protect,
  deleteComment
);

export default router;