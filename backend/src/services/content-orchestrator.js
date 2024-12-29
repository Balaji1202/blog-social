const wordpressService = require('./wordpress.service');
const mediumService = require('./medium.service');
const webflowService = require('./webflow.service');
const socialMediaService = require('./social-media-integration');
const { BlogPost, PlatformConnection } = require('../models');
const { BlogPlatform } = require('../config/platforms');

class ContentOrchestratorService {
    async processNewBlogPost(connection, postData) {
        try {
            // Check if we've already processed this post
            const existingPost = await BlogPost.findOne({
                where: {
                    platformId: postData.platformId,
                    platformConnectionId: connection.id
                }
            });

            if (existingPost) {
                return existingPost;
            }

            // Create new blog post record
            const blogPost = await BlogPost.create({
                title: postData.title,
                content: postData.content,
                excerpt: postData.excerpt,
                url: postData.url,
                platformId: postData.platformId,
                platformConnectionId: connection.id,
                userId: connection.userId,
                publishedAt: postData.publishedAt
            });

            // Get user's social media connections
            const socialConnections = await PlatformConnection.findAll({
                where: {
                    userId: connection.userId,
                    platform: ['TWITTER', 'LINKEDIN']
                }
            });

            // Create social media posts for each platform
            for (const socialConnection of socialConnections) {
                await socialMediaService.createSocialPost(blogPost, socialConnection.platform);
            }

            return blogPost;
        } catch (error) {
            throw new Error(`Error processing blog post: ${error.message}`);
        }
    }

    async fetchAndProcessPosts(connection) {
        try {
            let posts;
            switch (connection.platform) {
                case BlogPlatform.WORDPRESS:
                    posts = await wordpressService.fetchLatestPosts(connection.id);
                    break;
                case BlogPlatform.MEDIUM:
                    posts = await mediumService.fetchLatestPosts(connection.id);
                    break;
                case BlogPlatform.WEBFLOW:
                    posts = await webflowService.fetchLatestPosts(connection.id);
                    break;
                default:
                    throw new Error(`Unsupported platform: ${connection.platform}`);
            }

            const processedPosts = [];
            for (const post of posts) {
                const processedPost = await this.processNewBlogPost(connection, post);
                processedPosts.push(processedPost);
            }

            return processedPosts;
        } catch (error) {
            throw new Error(`Error fetching and processing posts: ${error.message}`);
        }
    }

    async setupWebhooks(connection) {
        try {
            switch (connection.platform) {
                case BlogPlatform.WORDPRESS:
                    await wordpressService.setupWebhook(connection.id);
                    break;
                case BlogPlatform.MEDIUM:
                    await mediumService.setupPolling(connection.id);
                    break;
                case BlogPlatform.WEBFLOW:
                    await webflowService.setupWebhook(connection.id);
                    break;
                default:
                    throw new Error(`Unsupported platform: ${connection.platform}`);
            }
        } catch (error) {
            throw new Error(`Error setting up webhooks: ${error.message}`);
        }
    }

    // This method would be called by the webhook endpoints
    async handleWebhookEvent(platform, event) {
        try {
            const connection = await PlatformConnection.findOne({
                where: {
                    platform,
                    platformUserId: event.userId
                }
            });

            if (!connection) {
                throw new Error(`No connection found for platform ${platform}`);
            }

            let postData;
            switch (platform) {
                case BlogPlatform.WORDPRESS:
                    postData = this.parseWordPressWebhook(event);
                    break;
                case BlogPlatform.WEBFLOW:
                    postData = this.parseWebflowWebhook(event);
                    break;
                default:
                    throw new Error(`Unsupported platform for webhooks: ${platform}`);
            }

            return await this.processNewBlogPost(connection, postData);
        } catch (error) {
            throw new Error(`Error handling webhook event: ${error.message}`);
        }
    }

    parseWordPressWebhook(event) {
        return {
            title: event.post.title.rendered,
            content: event.post.content.rendered,
            excerpt: event.post.excerpt.rendered,
            publishedAt: event.post.date,
            url: event.post.link,
            platformId: event.post.id.toString()
        };
    }

    parseWebflowWebhook(event) {
        return {
            title: event.name,
            content: event.content,
            excerpt: event.summary,
            publishedAt: event.published_on,
            url: event.slug,
            platformId: event.id
        };
    }
}

module.exports = new ContentOrchestratorService();
