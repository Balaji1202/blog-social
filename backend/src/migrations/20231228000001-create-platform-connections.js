"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable("platform_connections", {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
			},
			user_id: {
				type: Sequelize.UUID,
				allowNull: false,
				references: {
					model: "users",
					key: "id",
				},
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			},
			platform: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			platform_user_id: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			platform_username: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			access_token: {
				type: Sequelize.TEXT,
				allowNull: false,
			},
			refresh_token: {
				type: Sequelize.TEXT,
				allowNull: true,
			},
			token_expires_at: {
				type: Sequelize.DATE,
				allowNull: true,
			},
			created_at: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.NOW,
			},
			updated_at: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.NOW,
			},
		});

		// Add unique constraint to prevent duplicate platform connections
		await queryInterface.addConstraint("platform_connections", {
			fields: ["user_id", "platform"],
			type: "unique",
			name: "unique_user_platform",
		});
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable("platform_connections");
	},
};
