const axios = require('axios');
const { oauthConfig } = require('../config/oauth');
const { PlatformConnection } = require('../models');
const { SocialPlatform, CMSPlatform, isValidPlatform } = require('../config/platforms');

class OAuthService {
  constructor() {
    this.platformHandlers = {
      [SocialPlatform.TWITTER]: {
        getAuthUrl: this.getTwitterAuthUrl.bind(this),
        handleCallback: this.handleTwitterCallback.bind(this)
      },
      [SocialPlatform.LINKEDIN]: {
        getAuthUrl: this.getLinkedInAuthUrl.bind(this),
        handleCallback: this.handleLinkedInCallback.bind(this)
      },
      [CMSPlatform.WORDPRESS]: {
        getAuthUrl: this.getWordPressAuthUrl.bind(this),
        handleCallback: this.handleWordPressCallback.bind(this)
      },
      [CMSPlatform.MEDIUM]: {
        getAuthUrl: this.getMediumAuthUrl.bind(this),
        handleCallback: this.handleMediumCallback.bind(this)
      },
      [CMSPlatform.WEBFLOW]: {
        getAuthUrl: this.getWebflowAuthUrl.bind(this),
        handleCallback: this.handleWebflowCallback.bind(this)
      }
    };
  }

  async getAuthUrl(platform, state) {
    if (!isValidPlatform(platform)) {
      throw new Error(`Invalid platform: ${platform}`);
    }

    const handler = this.platformHandlers[platform];
    if (!handler) {
      throw new Error(`OAuth not implemented for platform: ${platform}`);
    }

    return handler.getAuthUrl(state);
  }

  async handleCallback(platform, code, state) {
    if (!isValidPlatform(platform)) {
      throw new Error(`Invalid platform: ${platform}`);
    }

    const handler = this.platformHandlers[platform];
    if (!handler) {
      throw new Error(`OAuth not implemented for platform: ${platform}`);
    }

    return handler.handleCallback(code, state);
  }

  // Twitter OAuth methods
  async getTwitterAuthUrl(state) {
    const config = oauthConfig[SocialPlatform.TWITTER];
    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: config.callbackUrl,
      scope: config.scope.join(' '),
      state,
      response_type: 'code',
    });
    return `https://twitter.com/i/oauth2/authorize?${params.toString()}`;
  }

  async handleTwitterCallback(code) {
    const config = oauthConfig[SocialPlatform.TWITTER];
    const tokenResponse = await axios.post('https://api.twitter.com/2/oauth2/token', 
      new URLSearchParams({
        code,
        grant_type: 'authorization_code',
        client_id: config.clientId,
        redirect_uri: config.callbackUrl,
        code_verifier: 'challenge'
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64')}`
        }
      }
    );

    const userResponse = await axios.get('https://api.twitter.com/2/users/me', {
      headers: {
        Authorization: `Bearer ${tokenResponse.data.access_token}`
      }
    });

    return {
      accessToken: tokenResponse.data.access_token,
      refreshToken: tokenResponse.data.refresh_token,
      platformUserId: userResponse.data.data.id,
      platformUserName: userResponse.data.data.username
    };
  }

  // LinkedIn OAuth methods
  async getLinkedInAuthUrl(state) {
    const config = oauthConfig[SocialPlatform.LINKEDIN];
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: config.clientId,
      redirect_uri: config.callbackUrl,
      state,
      scope: config.scope.join(' ')
    });
    return `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
  }

  async handleLinkedInCallback(code) {
    const config = oauthConfig[SocialPlatform.LINKEDIN];
    const tokenResponse = await axios.post('https://www.linkedin.com/oauth/v2/accessToken',
      new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: config.callbackUrl,
        client_id: config.clientId,
        client_secret: config.clientSecret
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    const userResponse = await axios.get('https://api.linkedin.com/v2/me', {
      headers: {
        Authorization: `Bearer ${tokenResponse.data.access_token}`
      }
    });

    return {
      accessToken: tokenResponse.data.access_token,
      refreshToken: tokenResponse.data.refresh_token,
      platformUserId: userResponse.data.id,
      platformUserName: `${userResponse.data.localizedFirstName} ${userResponse.data.localizedLastName}`
    };
  }

  // WordPress OAuth methods
  async getWordPressAuthUrl(state) {
    const config = oauthConfig[CMSPlatform.WORDPRESS];
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: config.clientId,
      redirect_uri: config.callbackUrl,
      state,
      scope: config.scope.join(' ')
    });
    return `https://public-api.wordpress.com/oauth2/authorize?${params.toString()}`;
  }

  async handleWordPressCallback(code) {
    const config = oauthConfig[CMSPlatform.WORDPRESS];
    const tokenResponse = await axios.post('https://public-api.wordpress.com/oauth2/token',
      new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: config.callbackUrl,
        client_id: config.clientId,
        client_secret: config.clientSecret
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    const userResponse = await axios.get('https://public-api.wordpress.com/rest/v1.1/me', {
      headers: {
        Authorization: `Bearer ${tokenResponse.data.access_token}`
      }
    });

    return {
      accessToken: tokenResponse.data.access_token,
      refreshToken: null, // WordPress doesn't provide refresh tokens
      platformUserId: userResponse.data.ID.toString(),
      platformUserName: userResponse.data.username
    };
  }

  // Medium OAuth methods
  async getMediumAuthUrl(state) {
    const config = oauthConfig[CMSPlatform.MEDIUM];
    const params = new URLSearchParams({
      client_id: config.clientId,
      state,
      scope: config.scope.join(','),
      response_type: 'code',
      redirect_uri: config.callbackUrl
    });
    return `https://medium.com/m/oauth/authorize?${params.toString()}`;
  }

  async handleMediumCallback(code) {
    const config = oauthConfig[CMSPlatform.MEDIUM];
    const tokenResponse = await axios.post('https://api.medium.com/v1/tokens',
      new URLSearchParams({
        code,
        client_id: config.clientId,
        client_secret: config.clientSecret,
        grant_type: 'authorization_code',
        redirect_uri: config.callbackUrl
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
          'Accept-Charset': 'utf-8'
        }
      }
    );

    const userResponse = await axios.get('https://api.medium.com/v1/me', {
      headers: {
        Authorization: `Bearer ${tokenResponse.data.access_token}`
      }
    });

    return {
      accessToken: tokenResponse.data.access_token,
      refreshToken: tokenResponse.data.refresh_token,
      platformUserId: userResponse.data.data.id,
      platformUserName: userResponse.data.data.username
    };
  }

  // Webflow OAuth methods
  async getWebflowAuthUrl(state) {
    const config = oauthConfig[CMSPlatform.WEBFLOW];
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: config.clientId,
      state,
      scope: config.scope.join(' '),
      redirect_uri: config.callbackUrl
    });
    return `https://webflow.com/oauth/authorize?${params.toString()}`;
  }

  async handleWebflowCallback(code) {
    const config = oauthConfig[CMSPlatform.WEBFLOW];
    const tokenResponse = await axios.post('https://api.webflow.com/oauth/access_token',
      {
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: config.callbackUrl
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const userResponse = await axios.get('https://api.webflow.com/user', {
      headers: {
        Authorization: `Bearer ${tokenResponse.data.access_token}`
      }
    });

    return {
      accessToken: tokenResponse.data.access_token,
      refreshToken: null, // Webflow doesn't provide refresh tokens
      platformUserId: userResponse.data._id,
      platformUserName: userResponse.data.email
    };
  }

  // Store platform connection in database
  async storePlatformConnection(userId, platform, connectionData) {
    const { accessToken, refreshToken, platformUserId, platformUserName } = connectionData;

    const [connection, created] = await PlatformConnection.findOrCreate({
      where: { userId, platform },
      defaults: {
        connected: true,
        platformUserId,
        platformUserName,
        settings: {
          accessToken,
          refreshToken
        }
      }
    });

    if (!created) {
      await connection.update({
        connected: true,
        platformUserId,
        platformUserName,
        settings: {
          accessToken,
          refreshToken
        }
      });
    }

    return connection;
  }
}

module.exports = new OAuthService();
