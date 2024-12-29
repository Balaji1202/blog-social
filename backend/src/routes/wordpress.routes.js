const express = require('express');
const router = express.Router();
const wordpressService = require('../services/wordpress.service');
const { authenticateToken } = require('../middleware/auth');

// OAuth callback route
router.get('/callback', async (req, res) => {
    try {
        const { code } = req.query;
        const result = await wordpressService.authenticate(code, process.env.WORDPRESS_REDIRECT_URI);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Fetch latest posts
router.get('/posts/:connectionId', authenticateToken, async (req, res) => {
    try {
        const posts = await wordpressService.fetchLatestPosts(req.params.connectionId);
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Webhook endpoint for new post notifications
router.post('/webhook', async (req, res) => {
    try {
        // Verify webhook signature
        // Process new post notification
        res.status(200).send('OK');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
