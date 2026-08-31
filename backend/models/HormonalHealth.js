import mongoose from "mongoose";

const hormonalHealthSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    cycleStartDate: {
      type: Date,
      required: true,
    },

    cycleLength: {
      type: Number,
      default: 28,
    },

    periodLength: {
      type: Number,
      default: 5,
    },

    mood: {
      type: String,
      enum: [
        "Happy",
        "Good",
        "Okay",
        "Low",
        "Irritated",
        "Tired",
      ],
      default: "Good",
    },

    symptoms: [
      {
        type: String,
      },
    ],

    symptomSeverity: {
      type: Number,
      min: 1,
      max: 5,
      default: 1,
    },

    history: [
      {
        date: {
          type: Date,
          default: Date.now,
        },

        mood: {
          type: String,
        },

        symptoms: [
          {
            type: String,
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("HormonalHealth", hormonalHealthSchema);