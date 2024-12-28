const { sequelize } = require("../config/database");
const { DataTypes } = require("sequelize");

// Import models
const User = require("./user");
const PlatformConnection = require("./PlatformConnection");
const BlogPost = require("./BlogPost");
const SocialPost = require("./SocialPost");

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
