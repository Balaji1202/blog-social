const express = require("express");
const { authenticateToken } = require("../middleware/auth");
const socialMediaIntegrationService = require("../services/social-media-integration");
const contentSummarizationService = require("../services/content-summarization");
const { SocialPost, BlogPost } = require("../models");

const router = express.Router();

// Get all social posts for the authenticated user
router.get("/", authenticateToken, async (req, res) => {
	try {
		const posts = await SocialPost.findAll({
			where: {
				userId: req.user.id,
			},
			order: [["createdAt", "DESC"]],
		});
		res.json(posts);
	} catch (error) {
		res.status(500).json({ error: "Error fetching social posts" });
	}
});

// Create a new social post from a blog post
router.post("/create", authenticateToken, async (req, res) => {
	try {
		const { blogPostId, platform } = req.body;

		const blogPost = await BlogPost.findOne({
			where: {
				id: blogPostId,
				userId: req.user.id,
			},
		});

		if (!blogPost) {
			return res.status(404).json({ error: "Blog post not found" });
		}

		const socialPost = await socialMediaIntegrationService.createSocialPost(
			blogPost,
			platform
		);

		res.status(201).json(socialPost);
	} catch (error) {
		res.status(500).json({ error: "Error creating social post" });
	}
});

// Schedule a social post
router.post("/schedule", authenticateToken, async (req, res) => {
	try {
		const { blogPostId, platform, scheduledTime } = req.body;

		const blogPost = await BlogPost.findOne({
			where: {
				id: blogPostId,
				userId: req.user.id,
			},
		});

		if (!blogPost) {
			return res.status(404).json({ error: "Blog post not found" });
		}

		const scheduledPost = await socialMediaIntegrationService.schedulePost(
			blogPost,
			platform,
			scheduledTime
		);

		res.status(201).json(scheduledPost);
	} catch (error) {
		res.status(500).json({ error: "Error scheduling social post" });
	}
});

// Generate content variants for a blog post
router.post("/variants", authenticateToken, async (req, res) => {
	try {
		const { blogPostId, platform, count = 3 } = req.body;

		const blogPost = await BlogPost.findOne({
			where: {
				id: blogPostId,
				userId: req.user.id,
			},
		});

		if (!blogPost) {
			return res.status(404).json({ error: "Blog post not found" });
		}

		const variants = await contentSummarizationService.generateSummaryVariants(
			blogPost.content,
			platform,
			count
		);

		res.json({ variants });
	} catch (error) {
		res.status(500).json({ error: "Error generating content variants" });
	}
});

// Get a single social post
router.get("/:id", authenticateToken, async (req, res) => {
	try {
		const post = await SocialPost.findOne({
			where: {
				id: req.params.id,
				userId: req.user.id,
			},
		});

		if (!post) {
			return res.status(404).json({ error: "Social post not found" });
		}

		res.json(post);
	} catch (error) {
		res.status(500).json({ error: "Error fetching social post" });
	}
});

module.exports = router;
