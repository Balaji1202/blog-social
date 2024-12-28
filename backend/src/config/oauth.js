const { SocialPlatform, CMSPlatform } = require("./platforms");

const oauthConfig = {
	[SocialPlatform.TWITTER]: {
		clientId: process.env.TWITTER_CLIENT_ID,
		clientSecret: process.env.TWITTER_CLIENT_SECRET,
		callbackUrl: `${process.env.BACKEND_URL}/auth/twitter/callback`,
		scope: ["tweet.read", "tweet.write", "users.read"],
	},
	[SocialPlatform.LINKEDIN]: {
		clientId: process.env.LINKEDIN_CLIENT_ID,
		clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
		callbackUrl: `${process.env.BACKEND_URL}/auth/linkedin/callback`,
		scope: ["r_liteprofile", "r_emailaddress", "w_member_social"],
	},
	[CMSPlatform.WORDPRESS]: {
		clientId: process.env.WORDPRESS_CLIENT_ID,
		clientSecret: process.env.WORDPRESS_CLIENT_SECRET,
		callbackUrl: `${process.env.BACKEND_URL}/auth/wordpress/callback`,
		scope: ["posts", "offline_access"],
	},
	[CMSPlatform.MEDIUM]: {
		clientId: process.env.MEDIUM_CLIENT_ID,
		clientSecret: process.env.MEDIUM_CLIENT_SECRET,
		callbackUrl: `${process.env.BACKEND_URL}/auth/medium/callback`,
		scope: ["basicProfile", "listPublications"],
	},
	[CMSPlatform.WEBFLOW]: {
		clientId: process.env.WEBFLOW_CLIENT_ID,
		clientSecret: process.env.WEBFLOW_CLIENT_SECRET,
		callbackUrl: `${process.env.BACKEND_URL}/auth/webflow/callback`,
		scope: ["read_sites", "read_collections"],
	},
};

// Validate required environment variables
const validateOAuthConfig = () => {
	const requiredEnvVars = [
		"BACKEND_URL",
		"TWITTER_CLIENT_ID",
		"TWITTER_CLIENT_SECRET",
		"LINKEDIN_CLIENT_ID",
		"LINKEDIN_CLIENT_SECRET",
		"WORDPRESS_CLIENT_ID",
		"WORDPRESS_CLIENT_SECRET",
		"MEDIUM_CLIENT_ID",
		"MEDIUM_CLIENT_SECRET",
		"WEBFLOW_CLIENT_ID",
		"WEBFLOW_CLIENT_SECRET",
	];

	const missingVars = requiredEnvVars.filter(
		(varName) => !process.env[varName]
	);
	if (missingVars.length > 0) {
		throw new Error(
			`Missing required environment variables: ${missingVars.join(", ")}`
		);
	}
};

module.exports = {
	oauthConfig,
	validateOAuthConfig,
};
