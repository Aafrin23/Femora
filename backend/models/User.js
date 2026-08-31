import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    age: {
      type: Number,
      required: true,
      min: 13,
      max: 100,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    // ============================================================
    // SETTINGS
    // ============================================================

    settings: {
      theme: {
        type: String,
        enum: ["light", "dark", "system"],
        default: "light",
      },

      accountPrivacy: {
        type: String,
        enum: ["private", "public"],
        default: "private",
      },

      aiEnabled: {
        type: Boolean,
        default: true,
      },

      personalizedAI: {
        type: Boolean,
        default: true,
      },

      language: {
        type: String,
        default: "English",
      },

      landingPage: {
        type: String,
        enum: [
          "Dashboard",
          "Community",
          "Learning Hub",
          "Inspiration Hub",
        ],
        default: "Dashboard",
      },

      motivationalMessages: {
        type: Boolean,
        default: true,
      },

      autoSave: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;