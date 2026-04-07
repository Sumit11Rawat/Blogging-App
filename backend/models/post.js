const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },

  content: {
    type: String,
    required: true
  },

  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  tags: [String],
  image: String,

  // 👍 Likes
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  status: { 
    type: String, 
    enum: ["draft", "published"], 
    default: "published" 
  },

  // 💬 Comments + Replies
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      text: String,

      replies: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
          },
          text: String,
          createdAt: {
            type: Date,
            default: Date.now
          }
        }
      ],

      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ]

}, { timestamps: true });

module.exports = mongoose.model("Post", postSchema);