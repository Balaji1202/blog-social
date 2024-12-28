require("dotenv").config();
const app = require("./index");
const { sequelize } = require("./config/database");

const PORT = process.env.PORT || 3001;

async function startServer() {
	try {
		// Test database connection
		await sequelize.authenticate();
		console.log("Database connection has been established successfully.");

		// Sync database models
		await sequelize.sync();
		console.log("Database models synchronized.");

		// Start server
		app.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}`);
		});
	} catch (error) {
		console.error("Unable to start server:", error);
		process.exit(1);
	}
}

startServer();
