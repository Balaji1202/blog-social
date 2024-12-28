"use strict";
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
module.exports = {
	up: async (queryInterface, Sequelize) => {
		const hashedPassword = await bcrypt.hash("demo123", 10);

		return queryInterface.bulkInsert("users", [
			{
				id: uuidv4(),
				name: "Demo User",
				email: "demo@example.com",
				password: hashedPassword,
				created_at: new Date(),
				updated_at: new Date(),
			},
		]);
	},
	down: async (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete("users", null, {});
	},
};
