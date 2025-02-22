const express = require("express");
const multer = require("multer");
const Post = require("../Model/post");
const path = require("path");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

// Set up storage for uploaded images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Serve static images
router.use("/uploads", express.static("uploads"));

// Fetch All Posts (No Authentication Required)
router.get("/", async (req, res) => {
  const posts = await Post.find().sort({ _id: -1 });
  res.json(posts);
});

// Create a New Post (Protected)
router.post("/", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const { content } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const newPost = new Post({
      username: req.user.username,
      content,
      image: imageUrl,
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Like a Post (Protected)
router.post("/like/:id", verifyToken, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post) {
    post.likes += 1;
    await post.save();
    res.json(post);
  } else {
    res.status(404).json({ error: "Post not found" });
  }
});

// **Dislike a Post (Protected)**
router.post("/dislike/:id", verifyToken, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post) {
    post.dislikes += 1;
    await post.save();
    res.json(post);
  } else {
    res.status(404).json({ error: "Post not found" });
  }
});

// Add Comment (Protected)
router.post("/comment/:id", verifyToken, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post) {
    post.comments.push({ user: req.user.username, text: req.body.text });
    await post.save();
    res.json(post);
  } else {
    res.status(404).json({ error: "Post not found" });
  }
});

module.exports = router;
