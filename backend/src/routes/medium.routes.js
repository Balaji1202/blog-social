const express = require('express');
const router = express.Router();
const mediumService = require('../services/medium.service');
const { authenticateToken } = require('../middleware/auth');

// OAuth callback route
router.get('/callback', async (req, res) => {
    try {
        const { code } = req.query;
        const result = await mediumService.authenticate(code, process.env.MEDIUM_REDIRECT_URI);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Fetch latest posts
router.get('/posts/:connectionId', authenticateToken, async (req, res) => {
    try {
        const posts = await mediumService.fetchLatestPosts(req.params.connectionId);
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start polling for new posts
router.post('/polling/:connectionId', authenticateToken, async (req, res) => {
    try {
        await mediumService.setupPolling(req.params.connectionId);
        res.json({ message: 'Polling setup successful' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
