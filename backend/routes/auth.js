const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const verifyToken = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

const SECRET = "mysecretkey";
const Post = require("../models/post");

// SIGNUP
router.post("/signup", async (req, res) => {
  // console.log(req.body);
  const { name, email, password } = req.body;
  //   console.log(req.body);


  try {

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }



    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.json({
      message: "User created successfully",
      user
    });

  } catch (error) {

    res.status(500).json({
      message: "Signup error"
    });

  }

});


// LOGIN
router.post("/login", async (req, res) => {

  const { email, password } = req.body;
  //   console.log(req.body);


  try {

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password"
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
      userId: user._id,
      userName: user.name
    });

  } catch (error) {

    res.status(500).json({
      message: "Login error"
    });

  }

});


// PROTECTED ROUTE
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    const posts = await Post.find({ author: user._id }).sort({ createdAt: -1 });



    res.json({ user, posts });
  } catch (err) {
    res.status(500).json({ message: "Error fetching profile" });
  }
});

// UPLOAD PROFILE PICTURE
router.post("/profile-pic", verifyToken, upload.single("profilePic"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const profilePicPath = req.file.path;
    await User.findByIdAndUpdate(req.user.id, { profilePic: profilePicPath });
    res.json({ message: "Profile picture updated", profilePic: profilePicPath });
  } catch (err) {
    res.status(500).json({ message: "Error uploading profile picture" });
  }
});

// UPLOAD BACKGROUND IMAGE
router.post("/background-image", verifyToken, upload.single("backgroundImage"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const bgPath = req.file.path;
    await User.findByIdAndUpdate(req.user.id, { backgroundImage: bgPath });
    res.json({ message: "Background image updated", backgroundImage: bgPath });
  } catch (err) {
    res.status(500).json({ message: "Error uploading background image" });
  }
});

// UPDATE PROFILE DETAILS
router.put("/profile", verifyToken, async (req, res) => {
  const { name, bio, location, website } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, bio, location, website },
      { new: true }
    ).select("-password");
    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Error updating profile" });
  }
});

// FOLLOW / UNFOLLOW USER
router.post("/follow/:id", verifyToken, async (req, res) => {
  try {
    const userToFollowId = req.params.id;
    const currentUserId = req.user.id;

    if (userToFollowId === currentUserId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const userToFollow = await User.findById(userToFollowId);
    const currentUser = await User.findById(currentUserId);

    if (!userToFollow) {
      return res.status(404).json({ message: "User not found" });
    }

    const isFollowing = currentUser.following.includes(userToFollowId);

    if (isFollowing) {
      // Unfollow
      await User.findByIdAndUpdate(currentUserId, { $pull: { following: userToFollowId } });
      await User.findByIdAndUpdate(userToFollowId, { $pull: { followers: currentUserId } });
      res.json({ message: "Unfollowed successfully", isFollowing: false });
    } else {
      // Follow
      await User.findByIdAndUpdate(currentUserId, { $addToSet: { following: userToFollowId } });
      await User.findByIdAndUpdate(userToFollowId, { $addToSet: { followers: currentUserId } });
      res.json({ message: "Followed successfully", isFollowing: true });
    }
  } catch (err) {
    res.status(500).json({ message: "Error following/unfollowing user" });
  }
});

module.exports = router;