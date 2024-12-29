const axios = require('axios');
const { PlatformConnection } = require('../models');

class WordPressService {
    constructor() {
        this.baseUrl = '/wp-json/wp/v2';
    }

    async authenticate(code, redirectUri) {
        try {
            // OAuth2 authentication flow
            // This would be implemented based on WordPress OAuth2 specifications
            // Return tokens and user info
        } catch (error) {
            throw new Error(`WordPress authentication failed: ${error.message}`);
        }
    }

    async fetchLatestPosts(connectionId) {
        try {
            const connection = await PlatformConnection.findByPk(connectionId);
            if (!connection) {
                throw new Error('Platform connection not found');
            }

            const response = await axios.get(`${connection.blogUrl}${this.baseUrl}/posts`, {
                headers: {
                    'Authorization': `Bearer ${connection.accessToken}`
                }
            });

            return response.data.map(post => ({
                title: post.title.rendered,
                content: post.content.rendered,
                excerpt: post.excerpt.rendered,
                publishedAt: post.date,
                url: post.link,
                platformId: post.id.toString()
            }));
        } catch (error) {
            throw new Error(`Failed to fetch WordPress posts: ${error.message}`);
        }
    }

    async setupWebhook(connectionId) {
        try {
            const connection = await PlatformConnection.findByPk(connectionId);
            if (!connection) {
                throw new Error('Platform connection not found');
            }

            // Setup webhook for new post notifications
            // This would create a webhook in WordPress to notify our application
            // when new posts are published
        } catch (error) {
            throw new Error(`Failed to setup WordPress webhook: ${error.message}`);
        }
    }
}

module.exports = new WordPressService();
