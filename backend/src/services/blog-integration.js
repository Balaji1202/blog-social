const axios = require('axios');
const { BlogPost, PlatformConnection } = require('../models');

class BlogIntegrationService {
  async fetchPosts(platformConnection) {
    switch (platformConnection.platform) {
      case 'WEBFLOW':
        return await this.fetchWebflowPosts(platformConnection);
      case 'WORDPRESS':
        return await this.fetchWordPressPosts(platformConnection);
      case 'MEDIUM':
        return await this.fetchMediumPosts(platformConnection);
      default:
        throw new Error(`Unsupported platform: ${platformConnection.platform}`);
    }
  }

  async fetchWebflowPosts(platformConnection) {
    try {
      const response = await axios.get('https://api.webflow.com/sites/{site_id}/posts', {
        headers: {
          'Authorization': `Bearer ${platformConnection.accessToken}`,
          'accept-version': '1.0.0'
        }
      });

      return response.data.items.map(post => ({
        originalId: post._id,
        title: post.title,
        content: post.content,
        url: post.url,
        publishedAt: new Date(post.publishedOn),
        metadata: {
          author: post.author,
          tags: post.tags
        }
      }));
    } catch (error) {
      throw new Error(`Error fetching Webflow posts: ${error.message}`);
    }
  }

  async fetchWordPressPosts(platformConnection) {
    try {
      const response = await axios.get(`${platformConnection.metadata.siteUrl}/wp-json/wp/v2/posts`, {
        headers: {
          'Authorization': `Bearer ${platformConnection.accessToken}`
        }
      });

      return response.data.map(post => ({
        originalId: post.id.toString(),
        title: post.title.rendered,
        content: post.content.rendered,
        url: post.link,
        publishedAt: new Date(post.date),
        metadata: {
          author: post.author,
          categories: post.categories
        }
      }));
    } catch (error) {
      throw new Error(`Error fetching WordPress posts: ${error.message}`);
    }
  }

  async fetchMediumPosts(platformConnection) {
    try {
      const response = await axios.get('https://api.medium.com/v1/me/posts', {
        headers: {
          'Authorization': `Bearer ${platformConnection.accessToken}`
        }
      });

      return response.data.data.map(post => ({
        originalId: post.id,
        title: post.title,
        content: post.content,
        url: post.url,
        publishedAt: new Date(post.publishedAt),
        metadata: {
          author: post.authorId,
          tags: post.tags
        }
      }));
    } catch (error) {
      throw new Error(`Error fetching Medium posts: ${error.message}`);
    }
  }

  async saveBlogPost(platformConnection, postData) {
    try {
      const existingPost = await BlogPost.findOne({
        where: {
          platformConnectionId: platformConnection.id,
          originalId: postData.originalId
        }
      });

      if (existingPost) {
        return await existingPost.update(postData);
      }

      return await BlogPost.create({
        ...postData,
        platformConnectionId: platformConnection.id
      });
    } catch (error) {
      throw new Error(`Error saving blog post: ${error.message}`);
    }
  }

  async syncAllPosts(userId) {
    try {
      const connections = await PlatformConnection.findAll({
        where: {
          userId,
          platform: ['WEBFLOW', 'WORDPRESS', 'MEDIUM']
        }
      });

      for (const connection of connections) {
        const posts = await this.fetchPosts(connection);
        for (const post of posts) {
          await this.saveBlogPost(connection, post);
        }
      }
    } catch (error) {
      throw new Error(`Error syncing posts: ${error.message}`);
    }
  }
}

module.exports = new BlogIntegrationService();
