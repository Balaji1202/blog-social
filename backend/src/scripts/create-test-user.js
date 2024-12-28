require("dotenv").config();
const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const UserModel = require("../models/user");

async function createTestUser() {
	try {
		// Initialize User model
		const User = UserModel(sequelize, DataTypes);
		await sequelize.sync();

		// Check if test user already exists
		let testUser = await User.findOne({ where: { email: "test@example.com" } });

		if (!testUser) {
			testUser = await User.create({
				name: "Test User",
				email: "test@example.com",
				password: "test123",
			});
			console.log("Test user created successfully:", testUser.email);
		} else {
			console.log("Test user already exists:", testUser.email);
		}

		process.exit(0);
	} catch (error) {
		console.error("Error creating test user:", error);
		process.exit(1);
	}
}

createTestUser();
