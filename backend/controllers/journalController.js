import Journal from "../models/Journal.js";

// ============================================================
// CREATE JOURNAL ENTRY
// ============================================================

export const createJournal = async (req, res) => {
  try {
    const { title, content, mood, prompt } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        message: "Journal content is required",
      });
    }

    const journal = await Journal.create({
      user: req.user._id,
      title: title || "Today's Thoughts",
      content,
      mood: mood || "Calm",
      prompt: prompt || "",
    });

    res.status(201).json({
      message: "Journal entry saved successfully",
      journal,
    });
  } catch (error) {
    console.error("Create journal error:", error);

    res.status(500).json({
      message: "Failed to save journal entry",
    });
  }
};

// ============================================================
// GET ALL JOURNAL ENTRIES
// ============================================================

export const getJournals = async (req, res) => {
  try {
    const journals = await Journal.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      journals,
    });
  } catch (error) {
    console.error("Get journals error:", error);

    res.status(500).json({
      message: "Failed to fetch journal entries",
    });
  }
};

// ============================================================
// GET SINGLE JOURNAL
// ============================================================

export const getJournalById = async (req, res) => {
  try {
    const journal = await Journal.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!journal) {
      return res.status(404).json({
        message: "Journal entry not found",
      });
    }

    res.status(200).json({
      journal,
    });
  } catch (error) {
    console.error("Get journal error:", error);

    res.status(500).json({
      message: "Failed to fetch journal entry",
    });
  }
};

// ============================================================
// UPDATE JOURNAL
// ============================================================

export const updateJournal = async (req, res) => {
  try {
    const { title, content, mood, prompt } = req.body;

    const journal = await Journal.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!journal) {
      return res.status(404).json({
        message: "Journal entry not found",
      });
    }

    journal.title = title || journal.title;
    journal.content = content || journal.content;
    journal.mood = mood || journal.mood;
    journal.prompt = prompt || journal.prompt;

    await journal.save();

    res.status(200).json({
      message: "Journal entry updated successfully",
      journal,
    });
  } catch (error) {
    console.error("Update journal error:", error);

    res.status(500).json({
      message: "Failed to update journal entry",
    });
  }
};

// ============================================================
// DELETE JOURNAL
// ============================================================

export const deleteJournal = async (req, res) => {
  try {
    const journal = await Journal.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!journal) {
      return res.status(404).json({
        message: "Journal entry not found",
      });
    }

    await journal.deleteOne();

    res.status(200).json({
      message: "Journal entry deleted successfully",
    });
  } catch (error) {
    console.error("Delete journal error:", error);

    res.status(500).json({
      message: "Failed to delete journal entry",
    });
  }
};