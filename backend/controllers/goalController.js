import Goal from "../models/Goal.js";

// ============================================================
// GET ALL GOALS
// ============================================================

export const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json(goals);
  } catch (error) {
    console.error("Get goals error:", error);

    res.status(500).json({
      message: "Failed to fetch goals",
    });
  }
};

// ============================================================
// GET SINGLE GOAL
// ============================================================

export const getGoal = async (req, res) => {
  try {
    const goal = await Goal.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!goal) {
      return res.status(404).json({
        message: "Goal not found",
      });
    }

    res.status(200).json(goal);
  } catch (error) {
    console.error("Get goal error:", error);

    res.status(500).json({
      message: "Failed to fetch goal",
    });
  }
};

// ============================================================
// CREATE GOAL
// ============================================================

export const createGoal = async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      category,
      priority,
      targetDate,
      progress,
      milestones,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Goal title is required",
      });
    }

    const numericProgress = Number(progress) || 0;

    const goal = await Goal.create({
      user: req.user.id,
      title: title.trim(),
      description: description || "",
      type: type || "short-term",
      category: category || "Personal",
      priority: priority || "medium",
      targetDate: targetDate || null,
      progress: numericProgress,
      completed: numericProgress === 100,
      milestones: milestones || [],
    });

    res.status(201).json(goal);
  } catch (error) {
    console.error("Create goal error:", error);

    res.status(500).json({
      message: "Failed to create goal",
    });
  }
};

// ============================================================
// UPDATE GOAL
// ============================================================

export const updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!goal) {
      return res.status(404).json({
        message: "Goal not found",
      });
    }

    const {
      title,
      description,
      type,
      category,
      priority,
      targetDate,
      progress,
      completed,
      milestones,
    } = req.body;

    if (title !== undefined) goal.title = title;
    if (description !== undefined) goal.description = description;
    if (type !== undefined) goal.type = type;
    if (category !== undefined) goal.category = category;
    if (priority !== undefined) goal.priority = priority;
    if (targetDate !== undefined) goal.targetDate = targetDate;
    if (milestones !== undefined) goal.milestones = milestones;

    if (progress !== undefined) {
      goal.progress = Math.min(100, Math.max(0, Number(progress)));
    }

    if (completed !== undefined) {
      goal.completed = completed;
    }

    // Automatically complete when progress reaches 100
    if (goal.progress === 100) {
      goal.completed = true;
    }

    // If manually uncompleted, don't leave progress at 100
    if (goal.completed === false && goal.progress === 100) {
      goal.progress = 99;
    }

    const updatedGoal = await goal.save();

    res.status(200).json(updatedGoal);
  } catch (error) {
    console.error("Update goal error:", error);

    res.status(500).json({
      message: "Failed to update goal",
    });
  }
};

// ============================================================
// DELETE GOAL
// ============================================================

export const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!goal) {
      return res.status(404).json({
        message: "Goal not found",
      });
    }

    await goal.deleteOne();

    res.status(200).json({
      message: "Goal deleted successfully",
    });
  } catch (error) {
    console.error("Delete goal error:", error);

    res.status(500).json({
      message: "Failed to delete goal",
    });
  }
};