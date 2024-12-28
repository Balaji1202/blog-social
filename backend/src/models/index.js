const { sequelize } = require("../config/database");
const { DataTypes } = require("sequelize");

// Import models
const User = require("./user");
const PlatformConnection = require("./platform-connection");
const BlogPost = require("./blog-post");
const SocialPost = require("./social-post");

// Initialize models
const models = {
	User: User(sequelize, DataTypes),
	PlatformConnection: PlatformConnection(sequelize, DataTypes),
	BlogPost: BlogPost(sequelize, DataTypes),
	SocialPost: SocialPost(sequelize, DataTypes),
};

// Set up associations
Object.keys(models).forEach((modelName) => {
	if (models[modelName].associate) {
		models[modelName].associate(models);
	}
});

module.exports = models;
