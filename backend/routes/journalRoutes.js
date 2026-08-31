import express from "express";

import {
  createJournal,
  getJournals,
  getJournalById,
  updateJournal,
  deleteJournal,
} from "../controllers/journalController.js";

import {protect} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createJournal);

router.get("/", protect, getJournals);

router.get("/:id", protect, getJournalById);

router.put("/:id", protect, updateJournal);

router.delete("/:id", protect, deleteJournal);

export default router;