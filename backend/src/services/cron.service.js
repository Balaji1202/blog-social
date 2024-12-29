const cron = require('node-cron');
const { Op } = require('sequelize');
const { PlatformConnection, SocialPost } = require('../models');
const { BlogPlatform } = require('../config/platforms');
const contentOrchestrator = require('./content-orchestrator');
const wordpressService = require('./wordpress.service');
const mediumService = require('./medium.service');
const webflowService = require('./webflow.service');
const socialMediaService = require('./social-media-integration');
const logger = require('../config/logger');

class CronService {
    constructor() {
        this.jobs = new Map();
    }

    initialize() {
        // Run every 15 minutes to check for new Medium posts
        cron.schedule('*/15 * * * *', async () => {
            try {
                await this.pollMediumPosts();
            } catch (error) {
                logger.error('Error polling Medium posts:', error);
            }
        });

        // Run every hour to check for scheduled social media posts
        cron.schedule('0 * * * *', async () => {
            try {
                await this.publishScheduledPosts();
            } catch (error) {
                logger.error('Error publishing scheduled posts:', error);
            }
        });

        // Run daily to refresh OAuth tokens if needed
        cron.schedule('0 0 * * *', async () => {
            try {
                await this.refreshTokens();
            } catch (error) {
                logger.error('Error refreshing tokens:', error);
            }
        });
    }

    async pollMediumPosts() {
        try {
            const mediumConnections = await PlatformConnection.findAll({
                where: {
                    platform: BlogPlatform.MEDIUM,
                    active: true
                }
            });

            for (const connection of mediumConnections) {
                try {
                    await contentOrchestrator.fetchAndProcessPosts(connection);
                } catch (error) {
                    logger.error(`Error processing Medium posts for connection ${connection.id}:`, error);
                }
            }
        } catch (error) {
            throw new Error(`Error polling Medium posts: ${error.message}`);
        }
    }

    async publishScheduledPosts() {
        try {
            const currentTime = new Date();

            const scheduledPosts = await SocialPost.findAll({
                where: {
                    status: 'PENDING',
                    '$metadata.scheduledTime$': {
                        [Op.lte]: currentTime
                    }
                }
            });

            for (const post of scheduledPosts) {
                try {
                    await socialMediaService.publishPost(post);
                } catch (error) {
                    logger.error(`Error publishing scheduled post ${post.id}:`, error);
                }
            }
        } catch (error) {
            throw new Error(`Error publishing scheduled posts: ${error.message}`);
        }
    }

    async refreshTokens() {
        try {
            const connections = await PlatformConnection.findAll({
                where: {
                    active: true,
                    refreshToken: {
                        [Op.not]: null
                    }
                }
            });

            for (const connection of connections) {
                try {
                    // Check if token needs refresh (usually if it expires within 24 hours)
                    const tokenExpiresAt = new Date(connection.tokenExpiresAt);
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);

                    if (tokenExpiresAt < tomorrow) {
                        // Use the appropriate service based on the platform
                        let service;
                        switch (connection.platform) {
                            case BlogPlatform.WORDPRESS:
                                service = wordpressService;
                                break;
                            case BlogPlatform.MEDIUM:
                                service = mediumService;
                                break;
                            case BlogPlatform.WEBFLOW:
                                service = webflowService;
                                break;
                            default:
                                // For social media platforms, token refresh is handled by social media service
                                service = socialMediaService;
                        }

                        if (service.refreshToken) {
                            await service.refreshToken(connection);
                        } else {
                            logger.warn(`No refresh token method for platform ${connection.platform}`);
                        }
                    }
                } catch (error) {
                    logger.error(`Error refreshing token for connection ${connection.id}:`, error);
                }
            }
        } catch (error) {
            throw new Error(`Error refreshing tokens: ${error.message}`);
        }
    }
}

module.exports = new CronService();
