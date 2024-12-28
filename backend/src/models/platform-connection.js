const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class PlatformConnection extends Model {
		static associate(models) {
			PlatformConnection.belongsTo(models.User, {
				foreignKey: "userId",
				as: "user",
			});
			PlatformConnection.hasMany(models.BlogPost, {
				foreignKey: "platformConnectionId",
				as: "blogPosts",
			});
			PlatformConnection.hasMany(models.SocialPost, {
				foreignKey: "platformConnectionId",
				as: "socialPosts",
			});
		}
	}

	PlatformConnection.init(
		{
			id: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				primaryKey: true,
			},
			userId: {
				type: DataTypes.UUID,
				allowNull: false,
				references: {
					model: "Users",
					key: "id",
				},
			},
			platform: {
				type: DataTypes.ENUM(
					"WEBFLOW",
					"WORDPRESS",
					"MEDIUM",
					"LINKEDIN",
					"TWITTER"
				),
				allowNull: false,
			},
			accessToken: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
			refreshToken: {
				type: DataTypes.TEXT,
			},
			tokenExpiry: {
				type: DataTypes.DATE,
			},
			platformUserId: {
				type: DataTypes.STRING,
			},
			platformUserName: {
				type: DataTypes.STRING,
			},
			settings: {
				type: DataTypes.JSONB,
				defaultValue: {},
			},
		},
		{
			sequelize,
			modelName: "PlatformConnection",
		}
	);

	return PlatformConnection;
};
