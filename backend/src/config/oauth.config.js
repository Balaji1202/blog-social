const { CMSPlatform, SocialPlatform } = require("./platforms");

const config = {
	[CMSPlatform.MEDIUM]: {
		clientId: process.env.MEDIUM_CLIENT_ID,
		clientSecret: process.env.MEDIUM_CLIENT_SECRET,
		authorizationUrl: "https://medium.com/m/oauth/authorize",
		tokenUrl: "https://api.medium.com/v1/tokens",
		redirectUri: `${process.env.API_URL}/api/oauth/callback/medium`,
		scope: "basicProfile,listPublications,publishPost",
		userInfoUrl: "https://api.medium.com/v1/me",
	},
	[CMSPlatform.WEBFLOW]: {
		clientId: process.env.WEBFLOW_CLIENT_ID,
		clientSecret: process.env.WEBFLOW_CLIENT_SECRET,
		authorizationUrl: "https://webflow.com/oauth/authorize",
		tokenUrl: "https://api.webflow.com/oauth/access_token",
		redirectUri: `${process.env.API_URL}/api/oauth/callback/webflow`,
		scope: "sites:read collections:read items:read items:write",
		userInfoUrl: "https://api.webflow.com/user",
	},
	[SocialPlatform.TWITTER]: {
		clientId: process.env.TWITTER_CLIENT_ID,
		clientSecret: process.env.TWITTER_CLIENT_SECRET,
		authorizationUrl: "https://twitter.com/i/oauth2/authorize",
		tokenUrl: "https://api.twitter.com/2/oauth2/token",
		redirectUri: `${process.env.API_URL}/api/oauth/callback/twitter`,
		scope: "tweet.read tweet.write users.read offline.access",
		userInfoUrl: "https://api.twitter.com/2/users/me",
	},
	[SocialPlatform.LINKEDIN]: {
		clientId: process.env.LINKEDIN_CLIENT_ID,
		clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
		authorizationUrl: "https://www.linkedin.com/oauth/v2/authorization",
		tokenUrl: "https://www.linkedin.com/oauth/v2/accessToken",
		redirectUri: `${process.env.API_URL}/api/oauth/callback/linkedin`,
		scope: "r_liteprofile w_member_social",
		userInfoUrl: "https://api.linkedin.com/v2/me",
	},
};

module.exports = config;
