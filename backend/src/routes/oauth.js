const express = require("express");
const router = express.Router();
const { isValidPlatform } = require("../config/platforms");
const oauthService = require("../services/oauth-service");
const { authenticateToken } = require("../middleware/auth");
const logger = require("../config/logger");

// Get OAuth URL
router.get("/:platform/url", authenticateToken, async (req, res) => {
  try {
    const { platform } = req.params;
    if (!isValidPlatform(platform)) {
      return res.status(400).json({ error: `Invalid platform: ${platform}` });
    }

    const state = Buffer.from(JSON.stringify({
      userId: req.user.id,
      timestamp: Date.now()
    })).toString('base64');

    // Store state in session
    req.session.oauthState = state;
    
    const url = await oauthService.getAuthUrl(platform, state);
    res.json({ url });
  } catch (error) {
    logger.error("Get OAuth URL error:", error);
    res.status(500).json({ error: "Failed to generate OAuth URL" });
  }
});

// OAuth callback handler
router.get("/callback/:platform", authenticateToken, async (req, res) => {
  try {
    const { platform } = req.params;
    const { code, state } = req.query;

    if (!isValidPlatform(platform)) {
      return res.status(400).json({ error: `Invalid platform: ${platform}` });
    }

    // Validate state
    if (!state || state !== req.session.oauthState) {
      return res.status(400).json({ error: "Invalid OAuth state" });
    }

    // Validate state expiration
    try {
      const decoded = JSON.parse(Buffer.from(state, 'base64').toString());
      if (Date.now() - decoded.timestamp > 3600000) { // 1 hour expiration
        return res.status(400).json({ error: "OAuth state expired" });
      }
    } catch (error) {
      return res.status(400).json({ error: "Invalid OAuth state format" });
    }

    // Clear OAuth state
    delete req.session.oauthState;

    const connection = await oauthService.handleCallback(
      platform,
      code,
      req.user.id
    );

    // Redirect to frontend with success
    res.redirect(`${process.env.FRONTEND_URL}/settings/platforms?status=success&platform=${platform}`);
  } catch (error) {
    logger.error("OAuth callback error:", error);
    // Redirect to frontend with error
    res.redirect(`${process.env.FRONTEND_URL}/settings/platforms?status=error&platform=${platform}&message=${encodeURIComponent(error.message)}`);
  }
});

// Disconnect platform
router.post("/disconnect/:platform", authenticateToken, async (req, res) => {
  try {
    const { platform } = req.params;
    if (!isValidPlatform(platform)) {
      return res.status(400).json({ error: `Invalid platform: ${platform}` });
    }

    await oauthService.updatePlatformConnection(
      req.user.id,
      platform,
      { active: false }
    );

    res.json({ message: `Successfully disconnected from ${platform}` });
  } catch (error) {
    logger.error("Platform disconnect error:", error);
    res.status(500).json({ error: "Failed to disconnect platform" });
  }
});

module.exports = router;
