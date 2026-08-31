import Planner from "../models/Planner.js";

/*
========================================================
CREATE PLANNER
POST /api/planner
========================================================
*/

export const createPlanner = async (req, res) => {
  try {
    const {
      title,
      type,
      location,
      description,
      startDate,
      endDate,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Planner title is required.",
      });
    }

    const planner = await Planner.create({
      user: req.user._id,
      title: title.trim(),
      type: type || "Personal",
      location: location || "",
      description: description || "",
      startDate: startDate || null,
      endDate: endDate || null,
      days: [],
    });

    res.status(201).json({
      message: "Planner created successfully.",
      planner,
    });
  } catch (error) {
    console.error("Create planner error:", error);

    res.status(500).json({
      message: "Failed to create planner.",
      error: error.message,
    });
  }
};


/*
========================================================
GET ALL PLANNERS
GET /api/planner
========================================================
*/

export const getPlanners = async (req, res) => {
  try {
    const planners = await Planner.find({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      planners,
    });
  } catch (error) {
    console.error("Get planners error:", error);

    res.status(500).json({
      message: "Failed to fetch planners.",
      error: error.message,
    });
  }
};


/*
========================================================
GET SINGLE PLANNER
GET /api/planner/:id
========================================================
*/

export const getPlannerById = async (req, res) => {
  try {
    const planner = await Planner.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!planner) {
      return res.status(404).json({
        message: "Planner not found.",
      });
    }

    res.status(200).json({
      planner,
    });
  } catch (error) {
    console.error("Get planner error:", error);

    res.status(500).json({
      message: "Failed to fetch planner.",
      error: error.message,
    });
  }
};


/*
========================================================
UPDATE PLANNER
PUT /api/planner/:id
========================================================
*/

export const updatePlanner = async (req, res) => {
  try {
    const planner = await Planner.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!planner) {
      return res.status(404).json({
        message: "Planner not found.",
      });
    }

    const {
      title,
      type,
      location,
      description,
      startDate,
      endDate,
    } = req.body;

    if (title !== undefined) {
      planner.title = title;
    }

    if (type !== undefined) {
      planner.type = type;
    }

    if (location !== undefined) {
      planner.location = location;
    }

    if (description !== undefined) {
      planner.description = description;
    }

    if (startDate !== undefined) {
      planner.startDate = startDate;
    }

    if (endDate !== undefined) {
      planner.endDate = endDate;
    }

    await planner.save();

    res.status(200).json({
      message: "Planner updated successfully.",
      planner,
    });
  } catch (error) {
    console.error("Update planner error:", error);

    res.status(500).json({
      message: "Failed to update planner.",
      error: error.message,
    });
  }
};


/*
========================================================
DELETE PLANNER
DELETE /api/planner/:id
========================================================
*/

export const deletePlanner = async (req, res) => {
  try {
    const planner = await Planner.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!planner) {
      return res.status(404).json({
        message: "Planner not found.",
      });
    }

    res.status(200).json({
      message: "Planner deleted successfully.",
    });
  } catch (error) {
    console.error("Delete planner error:", error);

    res.status(500).json({
      message: "Failed to delete planner.",
      error: error.message,
    });
  }
};


/*
========================================================
ADD DAY
POST /api/planner/:id/days
========================================================
*/

export const addDay = async (req, res) => {
  try {
    const planner = await Planner.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!planner) {
      return res.status(404).json({
        message: "Planner not found.",
      });
    }

    const { title, date } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Day title is required.",
      });
    }

    planner.days.push({
      title: title.trim(),
      date: date || null,
      activities: [],
    });

    await planner.save();

    const newDay = planner.days[planner.days.length - 1];

    res.status(201).json({
      message: "Day added successfully.",
      day: newDay,
      planner,
    });
  } catch (error) {
    console.error("Add day error:", error);

    res.status(500).json({
      message: "Failed to add day.",
      error: error.message,
    });
  }
};


/*
========================================================
UPDATE DAY
PUT /api/planner/:id/days/:dayId
========================================================
*/

export const updateDay = async (req, res) => {
  try {
    const planner = await Planner.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!planner) {
      return res.status(404).json({
        message: "Planner not found.",
      });
    }

    const day = planner.days.id(req.params.dayId);

    if (!day) {
      return res.status(404).json({
        message: "Day not found.",
      });
    }

    const { title, date } = req.body;

    if (title !== undefined) {
      day.title = title;
    }

    if (date !== undefined) {
      day.date = date;
    }

    await planner.save();

    res.status(200).json({
      message: "Day updated successfully.",
      day,
    });
  } catch (error) {
    console.error("Update day error:", error);

    res.status(500).json({
      message: "Failed to update day.",
      error: error.message,
    });
  }
};


/*
========================================================
DELETE DAY
DELETE /api/planner/:id/days/:dayId
========================================================
*/

export const deleteDay = async (req, res) => {
  try {
    const planner = await Planner.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!planner) {
      return res.status(404).json({
        message: "Planner not found.",
      });
    }

    const day = planner.days.id(req.params.dayId);

    if (!day) {
      return res.status(404).json({
        message: "Day not found.",
      });
    }

    day.deleteOne();

    await planner.save();

    res.status(200).json({
      message: "Day deleted successfully.",
      planner,
    });
  } catch (error) {
    console.error("Delete day error:", error);

    res.status(500).json({
      message: "Failed to delete day.",
      error: error.message,
    });
  }
};


/*
========================================================
ADD ACTIVITY
POST /api/planner/:id/days/:dayId/activities
========================================================
*/

export const addActivity = async (req, res) => {
  try {
    const planner = await Planner.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!planner) {
      return res.status(404).json({
        message: "Planner not found.",
      });
    }

    const day = planner.days.id(req.params.dayId);

    if (!day) {
      return res.status(404).json({
        message: "Day not found.",
      });
    }

    const {
      title,
      time,
      location,
      notes,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Activity title is required.",
      });
    }

    day.activities.push({
      title: title.trim(),
      time: time || "",
      location: location || "",
      notes: notes || "",
      completed: false,
    });

    await planner.save();

    const newActivity =
      day.activities[day.activities.length - 1];

    res.status(201).json({
      message: "Activity added successfully.",
      activity: newActivity,
    });
  } catch (error) {
    console.error("Add activity error:", error);

    res.status(500).json({
      message: "Failed to add activity.",
      error: error.message,
    });
  }
};


/*
========================================================
UPDATE ACTIVITY
PUT /api/planner/:id/days/:dayId/activities/:activityId
========================================================
*/

export const updateActivity = async (req, res) => {
  try {
    const planner = await Planner.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!planner) {
      return res.status(404).json({
        message: "Planner not found.",
      });
    }

    const day = planner.days.id(req.params.dayId);

    if (!day) {
      return res.status(404).json({
        message: "Day not found.",
      });
    }

    const activity = day.activities.id(
      req.params.activityId
    );

    if (!activity) {
      return res.status(404).json({
        message: "Activity not found.",
      });
    }

    const {
      title,
      time,
      location,
      notes,
      completed,
    } = req.body;

    if (title !== undefined) {
      activity.title = title;
    }

    if (time !== undefined) {
      activity.time = time;
    }

    if (location !== undefined) {
      activity.location = location;
    }

    if (notes !== undefined) {
      activity.notes = notes;
    }

    if (completed !== undefined) {
      activity.completed = completed;
    }

    await planner.save();

    res.status(200).json({
      message: "Activity updated successfully.",
      activity,
    });
  } catch (error) {
    console.error("Update activity error:", error);

    res.status(500).json({
      message: "Failed to update activity.",
      error: error.message,
    });
  }
};


/*
========================================================
DELETE ACTIVITY
DELETE /api/planner/:id/days/:dayId/activities/:activityId
========================================================
*/

export const deleteActivity = async (req, res) => {
  try {
    const planner = await Planner.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!planner) {
      return res.status(404).json({
        message: "Planner not found.",
      });
    }

    const day = planner.days.id(req.params.dayId);

    if (!day) {
      return res.status(404).json({
        message: "Day not found.",
      });
    }

    const activity = day.activities.id(
      req.params.activityId
    );

    if (!activity) {
      return res.status(404).json({
        message: "Activity not found.",
      });
    }

    activity.deleteOne();

    await planner.save();

    res.status(200).json({
      message: "Activity deleted successfully.",
      planner,
    });
  } catch (error) {
    console.error("Delete activity error:", error);

    res.status(500).json({
      message: "Failed to delete activity.",
      error: error.message,
    });
  }
};