import mongoose from "mongoose";

const journalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      trim: true,
      default: "Today's Thoughts",
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    mood: {
      type: String,
      enum: [
        "Happy",
        "Loved",
        "Calm",
        "Sad",
        "Stressed",
        "Angry",
        "Grateful",
        "Tired",
      ],
      default: "Calm",
    },

    prompt: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Journal = mongoose.model("Journal", journalSchema);

export default Journal;