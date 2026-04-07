// models/Comment.js
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: { type: String, required: true, trim: true },
  author: { type: String, default: "Guest" },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true, index: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null, index: true },
  likes: { type: Number, default: 0 },
  likedBy: [{ type: String }], // Store user IDs as strings
}, { timestamps: true });

// Compound index for efficient nested queries
commentSchema.index({ postId: 1, parentId: 1, createdAt: -1 });

// Helper method to populate nested replies (optional)
commentSchema.statics.getNestedComments = async function(postId, maxDepth = 5) {
  // Implementation depends on your needs - aggregation or recursive fetch
};

module.exports = mongoose.model("Comment", commentSchema);