// routes/post.js
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Post = require("../models/post");
const Comment = require("../models/comment"); // ✅ Capital 'C' - must match your model file export
const verifyToken = require("../middleware/auth");

// ─────────────────────────────────────────────────────────────
// 📌 HELPER: Build nested comment tree from flat array
// ─────────────────────────────────────────────────────────────
const buildCommentTree = (comments, parentId = null) => {
  return comments
    .filter(cmt => {
      // Handle both null and undefined parentId comparisons
      const cmtParent = cmt.parentId ? cmt.parentId.toString() : null;
      const targetParent = parentId ? parentId.toString() : null;
      return cmtParent === targetParent;
    })
    .map(cmt => ({
      ...cmt.toObject ? cmt.toObject() : cmt, // Convert Mongoose doc to plain object
      replies: buildCommentTree(comments, cmt._id)
    }));
};

// ─────────────────────────────────────────────────────────────
// 📌 GET ALL POSTS (Home Page & Sidebar)
// ─────────────────────────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    // 🚀 Use aggregation to get actual comment counts for Trending
    const posts = await Post.aggregate([
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "postId",
          as: "comments"
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author"
        }
      },
      { $unwind: "$author" },
      {
        $project: {
          title: 1,
          content: 1,
          tags: 1,
          image: 1,
          status: 1,
          likes: 1,
          createdAt: 1,
          "author.name": 1,
          "author.email": 1,
          "author._id": 1,
          // We return the comments array so the frontend .length check still works
          comments: 1 
        }
      },
      { $sort: { createdAt: -1 } }
    ]);
    
    res.json(posts);
  } catch (err) {
    console.error("❌ GET /post error:", err);
    res.status(500).json({ message: "Server error fetching posts" });
  }
});

// ─────────────────────────────────────────────────────────────
// 📌 CREATE POST
// ─────────────────────────────────────────────────────────────
router.post("/create", verifyToken, async (req, res) => {
  try {
    const { title, content, tags, image, status } = req.body;

    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const post = new Post({
      title: title.trim(),
      content: content.trim(),
      tags: Array.isArray(tags) ? tags : [],
      image: image || "",
      author: req.user.id,
      status: status || "draft"
    });

    await post.save();

    const populatedPost = await Post.findById(post._id)
      .populate("author", "name email avatar");

    res.status(201).json({
      message: "Post created successfully",
      post: populatedPost
    });

  } catch (error) {
    console.error("❌ POST /post/create error:", error);
    res.status(500).json({ message: "Server error creating post" });
  }
});

// ─────────────────────────────────────────────────────────────
// 📌 GET SINGLE POST (PostDetail Page)
// ─────────────────────────────────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid post ID format" });
    }

    const post = await Post.findById(req.params.id)
      .populate("author", "name email avatar");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // ✅ Frontend expects post object directly (not wrapped)
    res.json(post);

  } catch (err) {
    console.error("❌ GET /post/:id error:", err);
    res.status(500).json({ message: "Server error fetching post" });
  }
});

// ─────────────────────────────────────────────────────────────
// 📌 UPDATE POST
// ─────────────────────────────────────────────────────────────
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { title, content, tags, status } = req.body;

    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid post ID format" });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Authorization check
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to edit this post" });
    }

    post.title = title.trim();
    post.content = content.trim();
    post.tags = Array.isArray(tags) ? tags : [];
    post.status = status || post.status;
    post.updatedAt = new Date();

    const updatedPost = await post.save();
    const populated = await Post.findById(updatedPost._id)
      .populate("author", "name email avatar");

    res.json(populated);

  } catch (err) {
    console.error("❌ PUT /post/:id error:", err);
    res.status(500).json({ message: "Server error updating post" });
  }
});

// ─────────────────────────────────────────────────────────────
// 📌 DELETE POST
// ─────────────────────────────────────────────────────────────
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid post ID format" });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this post" });
    }

    // Optional: Delete associated comments
    await Comment.deleteMany({ postId: req.params.id });

    await Post.findByIdAndDelete(req.params.id);

    res.json({ message: "Post deleted successfully" });

  } catch (err) {
    console.error("❌ DELETE /post/:id error:", err);
    res.status(500).json({ message: "Server error deleting post" });
  }
});

// ─────────────────────────────────────────────────────────────
// 📌 LIKE/UNLIKE POST
// ─────────────────────────────────────────────────────────────
router.post("/:id/like", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userId = req.user.id;
    if (!post.likes) post.likes = [];
    
    const hasLiked = post.likes.some(id => id.toString() === userId);

    let updatedPost;
    if (hasLiked) {
      updatedPost = await Post.findByIdAndUpdate(
        req.params.id,
        { $pull: { likes: userId } },
        { new: true }
      );
    } else {
      updatedPost = await Post.findByIdAndUpdate(
        req.params.id,
        { $addToSet: { likes: userId } },
        { new: true }
      );
    }

    res.json({ 
      likes: updatedPost.likes, 
      hasLiked: !hasLiked 
    });
  } catch (err) {
    console.error("❌ POST /post/:id/like error:", err);
    res.status(500).json({ message: "Server error toggling like" });
  }
});

// ════════════════════════════════════════════════════════════
// 💬 COMMENT ROUTES (Integrated with Post routes)
// ════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────
// 📌 GET COMMENTS FOR POST (with nested replies)
// ✅ This endpoint was MISSING - frontend needs this!
// ─────────────────────────────────────────────────────────────
router.get("/:postId/comments", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.postId)) {
      return res.status(400).json({ error: "Invalid post ID" });
    }

    // Fetch ALL comments for this post (flat list)
    const allComments = await Comment.find({ postId: req.params.postId })
      .sort({ createdAt: 1 }) // Oldest first for proper threading
      .lean(); // Return plain JS objects, not Mongoose docs

    // Build nested tree structure
    const nestedComments = buildCommentTree(allComments, null);

    // Ensure all comments have required fields for frontend
    const sanitizeComment = (cmt) => ({
      ...cmt,
      _id: cmt._id.toString(),
      likes: cmt.likes || 0,
      likedBy: Array.isArray(cmt.likedBy) ? cmt.likedBy : [],
      replies: cmt.replies?.map(sanitizeComment) || []
    });

    const sanitized = nestedComments.map(sanitizeComment);

    res.json(sanitized);

  } catch (err) {
    console.error("❌ GET /post/:postId/comments error:", err);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

// ─────────────────────────────────────────────────────────────
// 📌 CREATE COMMENT OR REPLY
// ✅ Works for both top-level comments and nested replies
// ─────────────────────────────────────────────────────────────
router.post("/:postId/comments", verifyToken, async (req, res) => {
  try {
    const { content, author, parentId } = req.body;
    const { postId } = req.params;

    // Validation
    if (!content?.trim()) {
      return res.status(400).json({ error: "Comment content is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: "Invalid post ID" });
    }

    // Verify post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // If parentId provided, verify it exists and belongs to same post
    if (parentId) {
      if (!mongoose.Types.ObjectId.isValid(parentId)) {
        return res.status(400).json({ error: "Invalid parent comment ID" });
      }
      const parentComment = await Comment.findById(parentId);
      if (!parentComment || parentComment.postId.toString() !== postId) {
        return res.status(400).json({ error: "Invalid parent comment" });
      }
    }

    // Create new comment
    const newComment = await Comment.create({
      content: content.trim(),
      author: req.user?.name || author?.trim() || "Guest",
      postId,
      parentId: parentId || null,
      likes: 0,              // ✅ Initialize likes
      likedBy: []            // ✅ Initialize likedBy array
    });

    // Populate the created comment for response
    const populatedComment = await Comment.findById(newComment._id).lean();

    // Sanitize response for frontend
    const responseComment = {
      ...populatedComment,
      _id: populatedComment._id.toString(),
      likes: populatedComment.likes || 0,
      likedBy: populatedComment.likedBy || [],
      replies: [] // New comments start with empty replies
    };

    res.status(201).json(responseComment);

  } catch (err) {
    console.error("❌ POST /post/:postId/comments error:", err);
    
    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ error: messages.join(", ") });
    }
    
    res.status(500).json({ error: "Failed to create comment" });
  }
});

// ─────────────────────────────────────────────────────────────
// 📌 LIKE/UNLIKE COMMENT
// ✅ Matches frontend's handleLikeComment expectations
// ─────────────────────────────────────────────────────────────
router.post("/comments/:commentId/like", verifyToken, async (req, res) => {
  try {
    const { commentId } = req.params;
    const { userId, action } = req.body; // action: 'like' | 'unlike'

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ error: "Invalid comment ID" });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // Use userId from body OR fallback to authenticated user ID
    const targetUserId = userId || req.user?.id;
    if (!targetUserId) {
      return res.status(400).json({ error: "User ID required for like action" });
    }

    const hasLiked = comment.likedBy?.includes(targetUserId);

    if (action === 'like' || (!action && !hasLiked)) {
      // Like the comment
      if (!hasLiked) {
        comment.likedBy.push(targetUserId);
        comment.likes = (comment.likes || 0) + 1;
      }
    } else {
      // Unlike the comment
      comment.likedBy = comment.likedBy.filter(id => id !== targetUserId);
      comment.likes = Math.max(0, (comment.likes || 0) - 1);
    }

    await comment.save();

    // Return sanitized comment for frontend
    const updatedComment = await Comment.findById(commentId).lean();
    res.json({
      ...updatedComment,
      _id: updatedComment._id.toString(),
      likes: updatedComment.likes || 0,
      likedBy: updatedComment.likedBy || []
    });

  } catch (err) {
    console.error("❌ POST /comments/:commentId/like error:", err);
    res.status(500).json({ error: "Failed to update like" });
  }
});

// ─────────────────────────────────────────────────────────────
// 📌 DELETE COMMENT (Optional but recommended)
// ─────────────────────────────────────────────────────────────
// router.delete("/comments/:commentId", verifyToken, async (req, res) => {
//   try {
//     const { commentId } = req.params;
    
//     if (!mongoose.Types.ObjectId.isValid(commentId)) {
//       return res.status(400).json({ error: "Invalid comment ID" });
//     }

//     const comment = await Comment.findById(commentId);
//     if (!comment) {
//       return res.status(404).json({ error: "Comment not found" });
//     }

//     // Authorization: Only comment author or post author can delete
//     const post = await Post.findById(comment.postId);
//     const isCommentAuthor = comment.author === req.user?.name || comment.author === req.user?.email;
//     const isPostAuthor = post?.author?.toString() === req.user.id;
    
//     if (!isCommentAuthor && !isPostAuthor) {
//       return res.status(403).json({ error: "Not authorized to delete this comment" });
//     }

//     // Delete comment and all its nested replies
//     const deleteReplies = async (parentId) => {
//       const replies = await Comment.find({ parentId });
//       for (const reply of replies) {
//         await deleteReplies(reply._id);
//         await Comment.findByIdAndDelete(reply._id);
//       }
//     };
    
//     await deleteReplies(commentId);
//     await Comment.findByIdAndDelete(commentId);

//     res.json({ message: "Comment deleted successfully" });

//   } catch (err) {
//     console.error("❌ DELETE /comments/:commentId error:", err);
//     res.status(500).json({ error: "Failed to delete comment" });
//   }
// });
// ── DELETE COMMENT ──
router.delete("/comments/:id", verifyToken, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        
        if (!comment) {
          return res.status(404).json({ message: 'Comment not found' });
        }
        
        // ✅ Check if user owns the comment
        if (String(comment.userId) !== String(req.user.userId)) {
          return res.status(403).json({ 
            message: 'Forbidden: You can only delete your own comments' 
          });
        }
        
        await Comment.findByIdAndDelete(req.params.id);
        res.json({ message: 'Comment deleted successfully' });
      } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
      }
  });
module.exports = router;