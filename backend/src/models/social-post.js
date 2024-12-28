const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class SocialPost extends Model {
		static associate(models) {
			SocialPost.belongsTo(models.BlogPost, {
				foreignKey: "blogPostId",
				as: "blogPost",
			});
			SocialPost.belongsTo(models.PlatformConnection, {
				foreignKey: "platformConnectionId",
				as: "platformConnection",
			});
		}
	}

	SocialPost.init(
		{
			id: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				primaryKey: true,
			},
			blogPostId: {
				type: DataTypes.UUID,
				allowNull: false,
				references: {
					model: "BlogPosts",
					key: "id",
				},
			},
			platformConnectionId: {
				type: DataTypes.UUID,
				allowNull: false,
				references: {
					model: "PlatformConnections",
					key: "id",
				},
			},
			content: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
			platform: {
				type: DataTypes.ENUM("LINKEDIN", "TWITTER"),
				allowNull: false,
			},
			status: {
				type: DataTypes.ENUM("PENDING", "PUBLISHED", "FAILED"),
				defaultValue: "PENDING",
			},
			publishedAt: {
				type: DataTypes.DATE,
			},
			platformPostId: {
				type: DataTypes.STRING,
			},
			metadata: {
				type: DataTypes.JSONB,
				defaultValue: {},
			},
		},
		{
			sequelize,
			modelName: "SocialPost",
		}
	);

	return SocialPost;
};
