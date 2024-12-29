const express = require('express');
const router = express.Router();
const webflowService = require('../services/webflow.service');
const { authenticateToken } = require('../middleware/auth');

// OAuth callback route
router.get('/callback', async (req, res) => {
    try {
        const { code } = req.query;
        const result = await webflowService.authenticate(code, process.env.WEBFLOW_REDIRECT_URI);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Fetch latest posts
router.get('/posts/:connectionId', authenticateToken, async (req, res) => {
    try {
        const posts = await webflowService.fetchLatestPosts(req.params.connectionId);
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Setup webhook for a site
router.post('/webhook-setup/:connectionId/:siteId', authenticateToken, async (req, res) => {
    try {
        const result = await webflowService.setupWebhook(req.params.connectionId, req.params.siteId);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Webhook endpoint for post updates
router.post('/webhook', async (req, res) => {
    try {
        // Verify webhook signature
        // Process post update
        res.status(200).send('OK');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
