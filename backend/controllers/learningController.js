
import LearningPost from "../models/Learning.js";
// ============================================================
// GET ALL POSTS
// ============================================================

export const getLearningPosts = async (req, res) => {
  try {
    const posts = await LearningPost.find()
      .sort({ createdAt: -1 })
      .populate("author", "name email");

    res.status(200).json(posts);
  } catch (error) {
    console.error("Get learning posts error:", error);

    res.status(500).json({
      message: "Failed to fetch learning posts",
    });
  }
};

// ============================================================
// CREATE POST
// ============================================================

export const createLearningPost = async (req, res) => {
  try {
    const {
      type,
      title,
      content,
      category,
      skillName,
      skillLevel,
      image,
      tags,
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required",
      });
    }

    const userId = req.user._id || req.user.id;

    const authorName =
      req.user.name ||
      req.user.username ||
      "Femora User";

    const post = await LearningPost.create({
      author: userId,
      authorName,
      type: type || "insight",
      title,
      content,
      category: category || "Personal Growth",
      skillName: skillName || "",
      skillLevel: skillLevel || "",
      image: image || "",
      tags: tags || [],
    });

    const populatedPost = await LearningPost.findById(post._id)
      .populate("author", "name email");

    res.status(201).json(populatedPost);
  } catch (error) {
    console.error("Create learning post error:", error);

    res.status(500).json({
      message: "Failed to create learning post",
    });
  }
};

// ============================================================
// DELETE POST
// ============================================================

export const deleteLearningPost = async (req, res) => {
  try {
    const post = await LearningPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const userId = String(req.user._id || req.user.id);

    if (String(post.author) !== userId) {
      return res.status(403).json({
        message: "You can only delete your own post",
      });
    }

    await LearningPost.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("Delete learning post error:", error);

    res.status(500).json({
      message: "Failed to delete post",
    });
  }
};

// ============================================================
// LIKE / UNLIKE
// ============================================================

export const toggleLearningLike = async (req, res) => {
  try {
    const post = await LearningPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const userId = String(req.user._id || req.user.id);

    const alreadyLiked = post.likes.some(
      (id) => String(id) === userId
    );

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (id) => String(id) !== userId
      );
    } else {
      post.likes.push(userId);
    }

    await post.save();

    res.status(200).json({
      liked: !alreadyLiked,
      likes: post.likes.length,
    });
  } catch (error) {
    console.error("Toggle like error:", error);

    res.status(500).json({
      message: "Failed to update like",
    });
  }
};

// ============================================================
// SAVE / UNSAVE
// ============================================================

export const toggleLearningSave = async (req, res) => {
  try {
    const post = await LearningPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const userId = String(req.user._id || req.user.id);

    const alreadySaved = post.saves.some(
      (id) => String(id) === userId
    );

    if (alreadySaved) {
      post.saves = post.saves.filter(
        (id) => String(id) !== userId
      );
    } else {
      post.saves.push(userId);
    }

    await post.save();

    res.status(200).json({
      saved: !alreadySaved,
      saves: post.saves.length,
    });
  } catch (error) {
    console.error("Toggle save error:", error);

    res.status(500).json({
      message: "Failed to update save",
    });
  }
};

// ============================================================
// ADD COMMENT
// ============================================================

export const addLearningComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        message: "Comment cannot be empty",
      });
    }

    const post = await LearningPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const userId = req.user._id || req.user.id;

    const userName =
      req.user.name ||
      req.user.username ||
      "Femora User";

    post.comments.push({
      user: userId,
      userName,
      text: text.trim(),
    });

    await post.save();

    res.status(200).json(post);
  } catch (error) {
    console.error("Add comment error:", error);

    res.status(500).json({
      message: "Failed to add comment",
    });
  }
};