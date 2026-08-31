import mongoose from "mongoose";

const communityPostSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    content: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      enum: [
        "Wellness",
        "Beauty",
        "Fashion",
        "Fitness",
        "Self Growth",
        "Career",
        "Education",
        "Lifestyle",
        "Relationships",
        "Other",
      ],
      default: "Other",
    },

    image: {
      type: String,
      default: "",
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    saves: [
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

const CommunityPost = mongoose.model(
  "CommunityPost",
  communityPostSchema
);

export default CommunityPost;