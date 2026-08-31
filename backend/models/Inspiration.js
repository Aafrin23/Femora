import mongoose from "mongoose";

const inspirationSchema = new mongoose.Schema(
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
      maxlength: 150,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },

    category: {
      type: String,
      enum: [
        "Education",
        "Career",
        "Fitness",
        "Habits",
        "Finance",
        "Self Growth",
      ],
      default: "Self Growth",
    },

    image: {
      type: String,
      default: "",
    },

    inspiredBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Inspiration", inspirationSchema);