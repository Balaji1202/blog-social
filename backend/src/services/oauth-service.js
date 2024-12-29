const axios = require("axios");
const { PlatformConnection } = require("../models/platform-connection");
const { User } = require("../models/user");
const oauthConfig = require("../config/oauth.config");
const logger = require("../config/logger");

class OAuthService {
  constructor() {
    this.config = oauthConfig;
  }

  async getAuthUrl(platform, state) {
    const config = this.config[platform];
    if (!config) {
      throw new Error(`Unsupported platform: ${platform}`);
    }

    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      response_type: "code",
      state,
      scope: config.scope,
    });

    return `${config.authorizationUrl}?${params.toString()}`;
  }

  async handleCallback(platform, code, userId) {
    try {
      const config = this.config[platform];
      if (!config) {
        throw new Error(`Unsupported platform: ${platform}`);
      }

      const tokenData = await this.getAccessToken(platform, code);
      const userInfo = await this.getUserInfo(platform, tokenData.access_token);

      const connection = await this.savePlatformConnection(userId, platform, {
        ...tokenData,
        platformUserId: userInfo.id,
        platformUsername: userInfo.username || userInfo.name,
        metadata: userInfo
      });

      return connection;
    } catch (error) {
      logger.error('OAuth callback error:', error);
      throw new Error(`Failed to handle OAuth callback: ${error.message}`);
    }
  }

  async getAccessToken(platform, code) {
    const config = this.config[platform];
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
      logger.error('Get access token error:', error);
      throw new Error(`Failed to get access token: ${error.message}`);
    }
  }

  async getUserInfo(platform, accessToken) {
    const config = this.config[platform];
    try {
      const response = await axios.get(config.userInfoUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response.data.data || response.data;
    } catch (error) {
      logger.error('Get user info error:', error);
      throw new Error(`Failed to get user info: ${error.message}`);
    }
  }

  async refreshAccessToken(platform, refreshToken) {
    const config = this.config[platform];
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
      logger.error('Refresh token error:', error);
      throw new Error(`Failed to refresh token: ${error.message}`);
    }
  }

  async savePlatformConnection(userId, platform, tokenData) {
    try {
      const [connection] = await PlatformConnection.upsert({
        userId,
        platform,
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        tokenType: tokenData.token_type,
        scope: tokenData.scope,
        platformUserId: tokenData.platformUserId,
        platformUsername: tokenData.platformUsername,
        expiresAt: tokenData.expires_in 
          ? new Date(Date.now() + tokenData.expires_in * 1000)
          : null,
        metadata: tokenData.metadata || {},
        active: true
      });

      return connection;
    } catch (error) {
      logger.error('Save platform connection error:', error);
      throw new Error(`Failed to save platform connection: ${error.message}`);
    }
  }
}

module.exports = new OAuthService();
