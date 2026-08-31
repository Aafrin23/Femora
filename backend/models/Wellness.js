import mongoose from "mongoose";

const wellnessSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    date: {
      type: String,
      required: true,
    },

    categories: {
      mental: {
        completed: {
          type: [String],
          default: [],
        },
      },

      physical: {
        completed: {
          type: [String],
          default: [],
        },
      },

      emotional: {
        completed: {
          type: [String],
          default: [],
        },
      },

      spiritual: {
        completed: {
          type: [String],
          default: [],
        },
      },

      social: {
        completed: {
          type: [String],
          default: [],
        },
      },
    },

    wellnessScore: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

wellnessSchema.index(
  { user: 1, date: 1 },
  { unique: true }
);

export default mongoose.model(
  "Wellness",
  wellnessSchema
);