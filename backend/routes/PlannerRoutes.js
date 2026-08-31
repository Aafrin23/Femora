import express from "express";

import {
  createPlanner,
  getPlanners,
  getPlannerById,
  updatePlanner,
  deletePlanner,

  addDay,
  updateDay,
  deleteDay,

  addActivity,
  updateActivity,
  deleteActivity,
} from "../controllers/plannerController.js";

import {protect} from "../middleware/authMiddleware.js";

const router = express.Router();


// ======================================================
// PLANNER ROUTES
// ======================================================

router.post("/", protect, createPlanner);

router.get("/", protect, getPlanners);

router.get("/:id", protect, getPlannerById);

router.put("/:id", protect, updatePlanner);

router.delete("/:id", protect, deletePlanner);


// ======================================================
// DAY ROUTES
// ======================================================

router.post("/:id/days", protect, addDay);

router.put("/:id/days/:dayId", protect, updateDay);

router.delete("/:id/days/:dayId", protect, deleteDay);


// ======================================================
// ACTIVITY ROUTES
// ======================================================

router.post(
  "/:id/days/:dayId/activities",
  protect,
  addActivity
);

router.put(
  "/:id/days/:dayId/activities/:activityId",
  protect,
  updateActivity
);

router.delete(
  "/:id/days/:dayId/activities/:activityId",
  protect,
  deleteActivity
);

export default router;