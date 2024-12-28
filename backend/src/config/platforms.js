const SocialPlatform = {
  TWITTER: 'TWITTER',
  LINKEDIN: 'LINKEDIN',
  FACEBOOK: 'FACEBOOK'
};

const CMSPlatform = {
  WEBFLOW: 'WEBFLOW',
  WORDPRESS: 'WORDPRESS',
  MEDIUM: 'MEDIUM'
};

const isValidPlatform = (platform) => {
  return (
    Object.values(SocialPlatform).includes(platform) ||
    Object.values(CMSPlatform).includes(platform)
  );
};

const isSocialPlatform = (platform) => {
  return Object.values(SocialPlatform).includes(platform);
};

const isCMSPlatform = (platform) => {
  return Object.values(CMSPlatform).includes(platform);
};

module.exports = {
  SocialPlatform,
  CMSPlatform,
  isValidPlatform,
  isSocialPlatform,
  isCMSPlatform
};
