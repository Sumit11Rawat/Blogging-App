const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },
  profilePic: {
    type: String,
    default: ""
  },
  backgroundImage: {
    type: String,
    default: ""
  },
  bio: {
    type: String,
    default: ""
  },
  location: {
    type: String,
    default: ""
  },
  website: {
    type: String,
    default: ""
  }
});

module.exports = mongoose.model("User", userSchema);