const { DataTypes } = require("sequelize");

module.exports = {
	up: async (queryInterface, Sequelize) => {
		// Users table
		await queryInterface.createTable("Users", {
			id: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				primaryKey: true,
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			settings: {
				type: DataTypes.JSONB,
				defaultValue: {},
			},
			createdAt: {
				type: DataTypes.DATE,
				allowNull: false,
			},
			updatedAt: {
				type: DataTypes.DATE,
				allowNull: false,
			},
		});

		// Platform Connections table
		await queryInterface.createTable("PlatformConnections", {
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
				onDelete: "CASCADE",
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
				allowNull: true,
			},
			tokenExpiry: {
				type: DataTypes.DATE,
				allowNull: true,
			},
			platformUserId: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			platformUserName: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			settings: {
				type: DataTypes.JSONB,
				defaultValue: {},
			},
			createdAt: {
				type: DataTypes.DATE,
				allowNull: false,
			},
			updatedAt: {
				type: DataTypes.DATE,
				allowNull: false,
			},
		});

		// Blog Posts table
		await queryInterface.createTable("BlogPosts", {
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
				onDelete: "CASCADE",
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
				allowNull: true,
			},
			metadata: {
				type: DataTypes.JSONB,
				defaultValue: {},
			},
			createdAt: {
				type: DataTypes.DATE,
				allowNull: false,
			},
			updatedAt: {
				type: DataTypes.DATE,
				allowNull: false,
			},
		});

		// Social Posts table
		await queryInterface.createTable("SocialPosts", {
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
				onDelete: "CASCADE",
			},
			platformConnectionId: {
				type: DataTypes.UUID,
				allowNull: false,
				references: {
					model: "PlatformConnections",
					key: "id",
				},
				onDelete: "CASCADE",
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
				allowNull: true,
			},
			platformPostId: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			metadata: {
				type: DataTypes.JSONB,
				defaultValue: {},
			},
			createdAt: {
				type: DataTypes.DATE,
				allowNull: false,
			},
			updatedAt: {
				type: DataTypes.DATE,
				allowNull: false,
			},
		});
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable("SocialPosts");
		await queryInterface.dropTable("BlogPosts");
		await queryInterface.dropTable("PlatformConnections");
		await queryInterface.dropTable("Users");
	},
};
