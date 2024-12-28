const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class BlogPost extends Model {
		static associate(models) {
			BlogPost.belongsTo(models.PlatformConnection, {
				foreignKey: "platformConnectionId",
				as: "platformConnection",
			});
			BlogPost.hasMany(models.SocialPost, {
				foreignKey: "blogPostId",
				as: "socialPosts",
			});
		}
	}

	BlogPost.init(
		{
			id: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				primaryKey: true,
			},
			platformConnectionId: {
				type: DataTypes.UUID,
				allowNull: false,
				references: {
					model: "PlatformConnections",
					key: "id",
				},
			},
			originalId: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			title: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			content: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
			url: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			publishedAt: {
				type: DataTypes.DATE,
				allowNull: false,
			},
			summary: {
				type: DataTypes.TEXT,
			},
			metadata: {
				type: DataTypes.JSONB,
				defaultValue: {},
			},
		},
		{
			sequelize,
			modelName: "BlogPost",
		}
	);

	return BlogPost;
};
