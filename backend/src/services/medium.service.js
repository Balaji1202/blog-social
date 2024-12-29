const axios = require('axios');
const { PlatformConnection } = require('../models');

class MediumService {
    constructor() {
        this.baseUrl = 'https://api.medium.com/v1';
    }

    async authenticate(code, redirectUri) {
        try {
            // Medium uses OAuth2
            const tokenResponse = await axios.post('https://api.medium.com/v1/tokens', {
                code,
                client_id: process.env.MEDIUM_CLIENT_ID,
                client_secret: process.env.MEDIUM_CLIENT_SECRET,
                grant_type: 'authorization_code',
                redirect_uri: redirectUri
            });

            // Get user details
            const userResponse = await axios.get(`${this.baseUrl}/me`, {
                headers: {
                    'Authorization': `Bearer ${tokenResponse.data.access_token}`
                }
            });

            return {
                accessToken: tokenResponse.data.access_token,
                refreshToken: tokenResponse.data.refresh_token,
                userId: userResponse.data.id,
                username: userResponse.data.username
            };
        } catch (error) {
            throw new Error(`Medium authentication failed: ${error.message}`);
        }
    }

    async fetchLatestPosts(connectionId) {
        try {
            const connection = await PlatformConnection.findByPk(connectionId);
            if (!connection) {
                throw new Error('Platform connection not found');
            }

            // Medium API doesn't provide a direct endpoint for user's posts
            // We need to use their RSS feed
            const feedUrl = `https://medium.com/feed/@${connection.username}`;
            const response = await axios.get(feedUrl);

            // Parse RSS feed and convert to our standard post format
            return this.parseRSSFeed(response.data);
        } catch (error) {
            throw new Error(`Failed to fetch Medium posts: ${error.message}`);
        }
    }

    parseRSSFeed(feedData) {
        // Implementation to parse Medium's RSS feed
        // Convert to standardized post format
        return [];
    }

    // Medium doesn't support webhooks, so we'll need to poll periodically
    async setupPolling(connectionId) {
        try {
            const connection = await PlatformConnection.findByPk(connectionId);
            if (!connection) {
                throw new Error('Platform connection not found');
            }

            // Setup polling mechanism
            // This would be handled by a separate worker process
        } catch (error) {
            throw new Error(`Failed to setup Medium polling: ${error.message}`);
        }
    }
}

module.exports = new MediumService();
