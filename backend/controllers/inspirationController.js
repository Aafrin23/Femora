import Inspiration from "../models/Inspiration.js";

// ============================================================
// CREATE INSPIRATION POST
// ============================================================

export const createInspiration = async (req, res) => {
  try {
    const { title, description, category, image } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: "Title and description are required",
      });
    }

    const inspiration = await Inspiration.create({
      user: req.user._id,
      title,
      description,
      category: category || "Self Growth",
      image: image || "",
    });

    const populatedPost = await Inspiration.findById(
      inspiration._id
    ).populate("user", "name email");

    res.status(201).json({
      message: "Achievement shared successfully",
      inspiration: populatedPost,
    });
  } catch (error) {
    console.error("Create inspiration error:", error);

    res.status(500).json({
      message: "Failed to create inspiration post",
      error: error.message,
    });
  }
};

// ============================================================
// GET ALL INSPIRATION POSTS
// ============================================================

export const getInspirations = async (req, res) => {
  try {
    const { category, search } = req.query;

    let filter = {};

    if (category && category !== "All") {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const inspirations = await Inspiration.find(filter)
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: inspirations.length,
      inspirations,
    });
  } catch (error) {
    console.error("Get inspirations error:", error);

    res.status(500).json({
      message: "Failed to get inspiration posts",
      error: error.message,
    });
  }
};

// ============================================================
// GET MY INSPIRATION POSTS
// ============================================================

export const getMyInspirations = async (req, res) => {
  try {
    const inspirations = await Inspiration.find({
      user: req.user._id,
    })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      inspirations,
    });
  } catch (error) {
    console.error("Get my inspirations error:", error);

    res.status(500).json({
      message: "Failed to get your inspiration posts",
      error: error.message,
    });
  }
};

// ============================================================
// INSPIRE / UNINSPIRE
// ============================================================

export const toggleInspire = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Inspiration.findById(id);

    if (!post) {
      return res.status(404).json({
        message: "Inspiration post not found",
      });
    }

    const userId = req.user._id.toString();

    const alreadyInspired = post.inspiredBy.some(
      (id) => id.toString() === userId
    );

    if (alreadyInspired) {
      post.inspiredBy = post.inspiredBy.filter(
        (id) => id.toString() !== userId
      );
    } else {
      post.inspiredBy.push(req.user._id);
    }

    await post.save();

    res.status(200).json({
      message: alreadyInspired
        ? "Inspiration removed"
        : "Inspired successfully",

      inspired: !alreadyInspired,

      inspires: post.inspiredBy.length,
    });
  } catch (error) {
    console.error("Toggle inspire error:", error);

    res.status(500).json({
      message: "Failed to update inspiration",
      error: error.message,
    });
  }
};

// ============================================================
// DELETE INSPIRATION
// ============================================================

export const deleteInspiration = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Inspiration.findById(id);

    if (!post) {
      return res.status(404).json({
        message: "Inspiration post not found",
      });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You can only delete your own posts",
      });
    }

    await Inspiration.findByIdAndDelete(id);

    res.status(200).json({
      message: "Inspiration deleted successfully",
    });
  } catch (error) {
    console.error("Delete inspiration error:", error);

    res.status(500).json({
      message: "Failed to delete inspiration",
      error: error.message,
    });
  }
};