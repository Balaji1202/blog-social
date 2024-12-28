const axios = require('axios');
const { SocialPost, PlatformConnection } = require('../models');
const contentSummarizationService = require('./contentSummarization');
const { SocialPlatform } = require('../config/platforms');

class SocialMediaIntegrationService {
  async createSocialPost(blogPost, platform) {
    try {
      const connection = await PlatformConnection.findOne({
        where: {
          userId: blogPost.userId,
          platform
        }
      });

      if (!connection) {
        throw new Error(`No ${platform} connection found for user`);
      }

      const summary = await contentSummarizationService.summarizeContent(
        blogPost.content,
        platform
      );

      const socialPost = await SocialPost.create({
        blogPostId: blogPost.id,
        platformConnectionId: connection.id,
        content: summary,
        platform,
        status: 'PENDING'
      });

      await this.publishPost(socialPost);
      return socialPost;
    } catch (error) {
      throw new Error(`Error creating social post: ${error.message}`);
    }
  }

  async publishPost(socialPost) {
    try {
      const connection = await PlatformConnection.findByPk(socialPost.platformConnectionId);
      
      switch (connection.platform) {
        case SocialPlatform.LINKEDIN:
          await this.publishToLinkedIn(socialPost, connection);
          break;
        case SocialPlatform.TWITTER:
          await this.publishToTwitter(socialPost, connection);
          break;
        default:
          throw new Error(`Unsupported platform: ${connection.platform}`);
      }

      await socialPost.update({
        status: 'PUBLISHED',
        publishedAt: new Date()
      });
    } catch (error) {
      await socialPost.update({
        status: 'FAILED',
        metadata: { error: error.message }
      });
      throw error;
    }
  }

  async publishToLinkedIn(socialPost, connection) {
    try {
      const response = await axios.post(
        'https://api.linkedin.com/v2/ugcPosts',
        {
          author: `urn:li:person:${connection.platformUserId}`,
          lifecycleState: 'PUBLISHED',
          specificContent: {
            'com.linkedin.ugc.ShareContent': {
              shareCommentary: {
                text: socialPost.content
              },
              shareMediaCategory: 'NONE'
            }
          },
          visibility: {
            'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${connection.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      throw new Error(`Error publishing to LinkedIn: ${error.message}`);
    }
  }

  async publishToTwitter(socialPost, connection) {
    try {
      const response = await axios.post(
        'https://api.twitter.com/2/tweets',
        {
          text: socialPost.content
        },
        {
          headers: {
            'Authorization': `Bearer ${connection.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      throw new Error(`Error publishing to Twitter: ${error.message}`);
    }
  }

  async schedulePost(blogPost, platform, scheduledTime) {
    try {
      const summary = await contentSummarizationService.summarizeContent(
        blogPost.content,
        platform
      );

      const connection = await PlatformConnection.findOne({
        where: {
          userId: blogPost.userId,
          platform
        }
      });

      const socialPost = await SocialPost.create({
        blogPostId: blogPost.id,
        platformConnectionId: connection.id,
        content: summary,
        platform,
        status: 'PENDING',
        metadata: { scheduledTime }
      });

      return socialPost;
    } catch (error) {
      throw new Error(`Error scheduling social post: ${error.message}`);
    }
  }
}

module.exports = new SocialMediaIntegrationService();
