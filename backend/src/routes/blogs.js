const express = require("express");
const { authenticateToken } = require("../middleware/auth");
const blogIntegrationService = require("../services/blogIntegration");
const { BlogPost } = require("../models/BlogPost");

const router = express.Router();

// Get all blog posts for the authenticated user
router.get("/", authenticateToken, async (req, res) => {
	try {
		const posts = await BlogPost.findAll({
			where: {
				userId: req.user.id,
			},
			order: [["publishedAt", "DESC"]],
		});
		res.json(posts);
	} catch (error) {
		res.status(500).json({ error: "Error fetching blog posts" });
	}
});

// Sync blog posts from all connected platforms
router.post("/sync", authenticateToken, async (req, res) => {
	try {
		await blogIntegrationService.syncAllPosts(req.user.id);
		res.json({ message: "Blog posts synced successfully" });
	} catch (error) {
		res.status(500).json({ error: "Error syncing blog posts" });
	}
});

// Get a single blog post
router.get("/:id", authenticateToken, async (req, res) => {
	try {
		const post = await BlogPost.findOne({
			where: {
				id: req.params.id,
				userId: req.user.id,
			},
		});

		if (!post) {
			return res.status(404).json({ error: "Blog post not found" });
		}

		res.json(post);
	} catch (error) {
		res.status(500).json({ error: "Error fetching blog post" });
	}
});

module.exports = router;
