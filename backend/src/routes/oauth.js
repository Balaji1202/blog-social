const express = require("express");
const router = express.Router();
const { isValidPlatform } = require("../config/platforms");
const oauthService = require("../services/oauth-service");
const { authenticateToken } = require("../middleware/auth");
const crypto = require("crypto");

// Generate OAuth state
const generateState = () => crypto.randomBytes(32).toString("hex");

// Initialize OAuth flow
router.get("/connect/:platform", authenticateToken, async (req, res) => {
	try {
		const { platform } = req.params;
		if (!isValidPlatform(platform)) {
			return res.status(400).json({ error: `Invalid platform: ${platform}` });
		}

		const state = generateState();
		// Store state in session or Redis for validation
		req.session.oauthState = state;

		const authUrl = await oauthService.getAuthUrl(platform, state);
		res.json({ authUrl });
	} catch (error) {
		console.error("OAuth connect error:", error);
		res.status(500).json({ error: "Failed to initialize OAuth flow" });
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

		// Validate state to prevent CSRF
		if (state !== req.session.oauthState) {
			return res.status(400).json({ error: "Invalid OAuth state" });
		}

		// Clear OAuth state
		delete req.session.oauthState;

		const connectionData = await oauthService.handleCallback(
			platform,
			code,
			state
		);
		const connection = await oauthService.storePlatformConnection(
			req.user.id,
			platform,
			connectionData
		);

		res.json({
			message: `Successfully connected to ${platform}`,
			connection,
		});
	} catch (error) {
		console.error("OAuth callback error:", error);
		res.status(500).json({ error: "Failed to complete OAuth flow" });
	}
});

module.exports = router;
