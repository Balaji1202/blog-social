export enum SocialPlatform {
	TWITTER = "TWITTER",
	LINKEDIN = "LINKEDIN",
	FACEBOOK = "FACEBOOK",
}

export enum CMSPlatform {
	WEBFLOW = "WEBFLOW",
	WORDPRESS = "WORDPRESS",
	MEDIUM = "MEDIUM",
}

export type Platform = SocialPlatform | CMSPlatform;

export const isValidPlatform = (platform: string): platform is Platform => {
	return (
		Object.values(SocialPlatform).includes(platform as SocialPlatform) ||
		Object.values(CMSPlatform).includes(platform as CMSPlatform)
	);
};

export const isSocialPlatform = (
	platform: string
): platform is SocialPlatform => {
	return Object.values(SocialPlatform).includes(platform as SocialPlatform);
};

export const isCMSPlatform = (platform: string): platform is CMSPlatform => {
	return Object.values(CMSPlatform).includes(platform as CMSPlatform);
};
