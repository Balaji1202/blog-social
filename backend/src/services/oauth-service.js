const axios = require("axios");
const { PlatformConnection } = require("../models/platform-connection");
const { User } = require("../models/user");
const platformConfig = require("../config/platforms");

class OAuthService {
	constructor() {
		this.platformConfig = platformConfig;
	}

	async generateAuthUrl(platform, userId) {
		const config = this.platformConfig[platform];
		if (!config) {
			throw new Error(`Unsupported platform: ${platform}`);
		}

		const state = this.generateState(userId);
		const params = new URLSearchParams({
			client_id: config.clientId,
			redirect_uri: config.redirectUri,
			response_type: "code",
			state,
			scope: config.scope,
		});

		return `${config.authorizationUrl}?${params.toString()}`;
	}

	async handleCallback(platform, code, state) {
		const config = this.platformConfig[platform];
		if (!config) {
			throw new Error(`Unsupported platform: ${platform}`);
		}

		const userId = this.validateState(state);
		const tokenResponse = await this.getAccessToken(platform, code);

		await this.savePlatformConnection(userId, platform, tokenResponse);

		return tokenResponse;
	}

	async getAccessToken(platform, code) {
		const config = this.platformConfig[platform];
		const params = new URLSearchParams({
			client_id: config.clientId,
			client_secret: config.clientSecret,
			code,
			redirect_uri: config.redirectUri,
			grant_type: "authorization_code",
		});

		try {
			const response = await axios.post(config.tokenUrl, params.toString(), {
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
			});

			return response.data;
		} catch (error) {
			throw new Error(`Failed to get access token: ${error.message}`);
		}
	}

	async refreshAccessToken(platform, refreshToken) {
		const config = this.platformConfig[platform];
		const params = new URLSearchParams({
			client_id: config.clientId,
			client_secret: config.clientSecret,
			refresh_token: refreshToken,
			grant_type: "refresh_token",
		});

		try {
			const response = await axios.post(config.tokenUrl, params.toString(), {
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
			});

			return response.data;
		} catch (error) {
			throw new Error(`Failed to refresh token: ${error.message}`);
		}
	}

	async savePlatformConnection(userId, platform, tokenData) {
		try {
			const user = await User.findByPk(userId);
			if (!user) {
				throw new Error(`User not found: ${userId}`);
			}

			await PlatformConnection.upsert({
				userId,
				platform,
				accessToken: tokenData.access_token,
				refreshToken: tokenData.refresh_token,
				expiresAt: tokenData.expires_in
					? new Date(Date.now() + tokenData.expires_in * 1000)
					: null,
			});
		} catch (error) {
			throw new Error(`Failed to save platform connection: ${error.message}`);
		}
	}

	generateState(userId) {
		return Buffer.from(
			JSON.stringify({ userId, timestamp: Date.now() })
		).toString("base64");
	}

	validateState(state) {
		try {
			const decoded = JSON.parse(Buffer.from(state, "base64").toString());
			const { userId, timestamp } = decoded;

			// Check if the state is not older than 1 hour
			if (Date.now() - timestamp > 3600000) {
				throw new Error("State has expired");
			}

			return userId;
		} catch (error) {
			throw new Error(`Invalid state: ${error.message}`);
		}
	}
}

module.exports = new OAuthService();
