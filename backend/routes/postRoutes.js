const express = require("express")
const router = express.Router()
const Post = require("../models/Post")
const upload = require("../multer")
const jwt = require("jsonwebtoken")
const authMiddleware = require("../middleware/authMiddleware") 

router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const { title, content, tags } = req.body
    const author = req.user.id 

    const newPost = new Post({
      title,
      content,
      author,
      tags: tags ? JSON.parse(tags) : [],
      image: req.file ? req.file.path : null
    })

    await newPost.save()
    res.status(201).json(newPost)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;

    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .populate("author", "username email")
      .populate("comments.user", "username email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "username email")
      .populate("comments.user", "username email")
    if (!post) return res.status(404).json({ message: "Post not found" })
    res.json(post)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post("/like/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) return res.status(404).json({ message: "Post not found" })

    const userId = req.user.id
    if (post.likes.includes(userId)) {
      post.likes.pull(userId)
    } else {
      post.likes.push(userId)
    }

    await post.save()
    res.json(post)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})


router.post("/comment/:id", authMiddleware, async (req, res) => {
  try {
    const { text } = req.body
    const post = await Post.findById(req.params.id)
    if (!post) return res.status(404).json({ message: "Post not found" })

    const comment = {
      user: req.user.id,
      text
    }

    post.comments.push(comment)
    await post.save()
    res.json(post)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})


router.delete("/delete/:id", authMiddleware, async (req, res) => {
  try {
    console.log("User from authMiddleware:", req.user); 
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await post.deleteOne();
    console.log(`Post ${req.params.id} deleted by user ${req.user.id}`);
    res.json({ message: "Post deleted" });
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({ error: err.message });
  }
});



router.put("/:id", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.author.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    if (title) post.title = title;
    if (content) post.content = content;
    if (tags) post.tags = JSON.parse(tags);
    if (req.file) post.image = req.file.path;

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/user/:userId", async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.userId })
      .populate("author", "username email")
      .populate("comments.user", "username email")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/search", async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const posts = await Post.find({
      $or: [
        { title: { $regex: query, $options: "i" } },      
        { tags: { $regex: query, $options: "i" } } 
      ]
    })
      .populate("author", "username email")
      .populate("comments.user", "username email")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router