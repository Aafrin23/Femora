import mongoose from "mongoose";

const milestoneSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true }
);

const goalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    type: {
      type: String,
      enum: ["short-term", "long-term"],
      default: "short-term",
    },

    category: {
      type: String,
      enum: [
        "Personal",
        "Wellness",
        "Beauty",
        "Learning",
        "Career",
        "Finance",
        "Fitness",
        "Mindfulness",
        "Other",
      ],
      default: "Personal",
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    targetDate: {
      type: Date,
      default: null,
    },

    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    completed: {
      type: Boolean,
      default: false,
    },

    milestones: {
      type: [milestoneSchema],
      default: [],
    },
  },

  {
    timestamps: true,
  }
);

const Goal = mongoose.model("Goal", goalSchema);

export default Goal;