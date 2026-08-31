import CommunityPost from "../models/Communitypost.js";
import Comment from "../models/Comment.js";

// ============================================================
// CREATE POST
// ============================================================

export const createPost = async (req, res) => {
  try {
    const { title, content, category, image } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required.",
      });
    }

    const post = await CommunityPost.create({
      author: req.user._id,
      title,
      content,
      category,
      image,
    });

    const populatedPost = await CommunityPost.findById(post._id)
      .populate("author", "name");

    res.status(201).json({
      message: "Post created successfully.",
      post: populatedPost,
    });
  } catch (error) {
    console.error("Create post error:", error);

    res.status(500).json({
      message: "Failed to create post.",
    });
  }
};

// ============================================================
// GET ALL POSTS
// ============================================================

export const getPosts = async (req, res) => {
  try {
    const posts = await CommunityPost.find()
      .populate("author", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      posts,
    });
  } catch (error) {
    console.error("Get posts error:", error);

    res.status(500).json({
      message: "Failed to fetch posts.",
    });
  }
};

// ============================================================
// GET SINGLE POST
// ============================================================

export const getPost = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id)
      .populate("author", "name");

    if (!post) {
      return res.status(404).json({
        message: "Post not found.",
      });
    }

    res.status(200).json({
      post,
    });
  } catch (error) {
    console.error("Get post error:", error);

    res.status(500).json({
      message: "Failed to fetch post.",
    });
  }
};

// ============================================================
// UPDATE POST
// ============================================================

export const updatePost = async (req, res) => {
  try {
    const { title, content, category, image } = req.body;

    const post = await CommunityPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found.",
      });
    }

    // Only the author can edit the post
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You can only edit your own posts.",
      });
    }

    post.title = title ?? post.title;
    post.content = content ?? post.content;
    post.category = category ?? post.category;
    post.image = image ?? post.image;

    await post.save();

    const updatedPost = await CommunityPost.findById(post._id)
      .populate("author", "name");

    res.status(200).json({
      message: "Post updated successfully.",
      post: updatedPost,
    });
  } catch (error) {
    console.error("Update post error:", error);

    res.status(500).json({
      message: "Failed to update post.",
    });
  }
};

// ============================================================
// DELETE POST
// ============================================================

export const deletePost = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found.",
      });
    }

    // Only the author can delete the post
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You can only delete your own posts.",
      });
    }

    // Delete comments belonging to this post
    await Comment.deleteMany({
      post: post._id,
    });

    await post.deleteOne();

    res.status(200).json({
      message: "Post deleted successfully.",
    });
  } catch (error) {
    console.error("Delete post error:", error);

    res.status(500).json({
      message: "Failed to delete post.",
    });
  }
};

// ============================================================
// LIKE / UNLIKE POST
// ============================================================

export const toggleLike = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found.",
      });
    }

    const userId = req.user._id;

    const alreadyLiked = post.likes.some(
      (id) => id.toString() === userId.toString()
    );

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      post.likes.push(userId);
    }

    await post.save();

    res.status(200).json({
      message: alreadyLiked
        ? "Post unliked."
        : "Post liked.",

      liked: !alreadyLiked,

      likeCount: post.likes.length,
    });
  } catch (error) {
    console.error("Toggle like error:", error);

    res.status(500).json({
      message: "Failed to like post.",
    });
  }
};

// ============================================================
// SAVE / UNSAVE POST
// ============================================================

export const toggleSave = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found.",
      });
    }

    const userId = req.user._id;

    const alreadySaved = post.saves.some(
      (id) => id.toString() === userId.toString()
    );

    if (alreadySaved) {
      post.saves = post.saves.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      post.saves.push(userId);
    }

    await post.save();

    res.status(200).json({
      message: alreadySaved
        ? "Post removed from saved posts."
        : "Post saved.",

      saved: !alreadySaved,

      saveCount: post.saves.length,
    });
  } catch (error) {
    console.error("Toggle save error:", error);

    res.status(500).json({
      message: "Failed to save post.",
    });
  }
};

// ============================================================
// ADD COMMENT
// ============================================================

export const addComment = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        message: "Comment cannot be empty.",
      });
    }

    const post = await CommunityPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found.",
      });
    }

    const comment = await Comment.create({
      post: post._id,
      author: req.user._id,
      content: content.trim(),
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate("author", "name");

    res.status(201).json({
      message: "Comment added successfully.",
      comment: populatedComment,
    });
  } catch (error) {
    console.error("Add comment error:", error);

    res.status(500).json({
      message: "Failed to add comment.",
    });
  }
};

// ============================================================
// GET COMMENTS
// ============================================================

export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({
      post: req.params.id,
    })
      .populate("author", "name")
      .sort({ createdAt: 1 });

    res.status(200).json({
      comments,
    });
  } catch (error) {
    console.error("Get comments error:", error);

    res.status(500).json({
      message: "Failed to fetch comments.",
    });
  }
};

// ============================================================
// DELETE COMMENT
// ============================================================

export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found.",
      });
    }

    if (
      comment.author.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You can only delete your own comments.",
      });
    }

    await comment.deleteOne();

    res.status(200).json({
      message: "Comment deleted successfully.",
    });
  } catch (error) {
    console.error("Delete comment error:", error);

    res.status(500).json({
      message: "Failed to delete comment.",
    });
  }
};