const axios = require('axios');
const { PlatformConnection } = require('../models');

class WebflowService {
    constructor() {
        this.baseUrl = 'https://api.webflow.com';
    }

    async authenticate(code, redirectUri) {
        try {
            const tokenResponse = await axios.post('https://api.webflow.com/oauth/access_token', {
                client_id: process.env.WEBFLOW_CLIENT_ID,
                client_secret: process.env.WEBFLOW_CLIENT_SECRET,
                code,
                grant_type: 'authorization_code',
                redirect_uri: redirectUri
            });

            // Get user info
            const userResponse = await axios.get(`${this.baseUrl}/user`, {
                headers: {
                    'Authorization': `Bearer ${tokenResponse.data.access_token}`
                }
            });

            return {
                accessToken: tokenResponse.data.access_token,
                userId: userResponse.data.id,
                workspaces: userResponse.data.workspaces
            };
        } catch (error) {
            throw new Error(`Webflow authentication failed: ${error.message}`);
        }
    }

    async fetchLatestPosts(connectionId) {
        try {
            const connection = await PlatformConnection.findByPk(connectionId);
            if (!connection) {
                throw new Error('Platform connection not found');
            }

            // Fetch sites in the workspace
            const sitesResponse = await axios.get(`${this.baseUrl}/sites`, {
                headers: {
                    'Authorization': `Bearer ${connection.accessToken}`
                }
            });

            // For each site, fetch collections (blog posts)
            const posts = [];
            for (const site of sitesResponse.data) {
                const collectionsResponse = await axios.get(`${this.baseUrl}/sites/${site.id}/collections`, {
                    headers: {
                        'Authorization': `Bearer ${connection.accessToken}`
                    }
                });

                // Find blog collection
                const blogCollection = collectionsResponse.data.find(c => c.type === 'blog');
                if (blogCollection) {
                    const itemsResponse = await axios.get(`${this.baseUrl}/collections/${blogCollection.id}/items`, {
                        headers: {
                            'Authorization': `Bearer ${connection.accessToken}`
                        }
                    });

                    posts.push(...itemsResponse.data.items.map(item => ({
                        title: item.name,
                        content: item.content,
                        excerpt: item.summary,
                        publishedAt: item.published_on,
                        url: item.slug,
                        platformId: item.id
                    })));
                }
            }

            return posts;
        } catch (error) {
            throw new Error(`Failed to fetch Webflow posts: ${error.message}`);
        }
    }

    async setupWebhook(connectionId, siteId) {
        try {
            const connection = await PlatformConnection.findByPk(connectionId);
            if (!connection) {
                throw new Error('Platform connection not found');
            }

            // Create webhook for collection item changes
            const response = await axios.post(`${this.baseUrl}/sites/${siteId}/webhooks`, {
                triggerType: 'collection_item_changed',
                url: `${process.env.API_URL}/api/webflow/webhook`
            }, {
                headers: {
                    'Authorization': `Bearer ${connection.accessToken}`
                }
            });

            return response.data;
        } catch (error) {
            throw new Error(`Failed to setup Webflow webhook: ${error.message}`);
        }
    }
}

module.exports = new WebflowService();
