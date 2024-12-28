require("dotenv").config();
const { Client } = require("pg");
const { execSync } = require("child_process");
const path = require("path");

async function initializeDatabase() {
	// Extract database name from DATABASE_URL
	const dbUrl = new URL(process.env.DATABASE_URL);
	const dbName = dbUrl.pathname.split("/")[1];

	// Create connection URL for postgres database
	const postgresUrl = new URL(process.env.DATABASE_URL);
	postgresUrl.pathname = "/postgres";

	const client = new Client({
		connectionString: postgresUrl.toString(),
	});

	try {
		await client.connect();

		// Check if database exists
		const checkDb = await client.query(
			`SELECT 1 FROM pg_database WHERE datname = $1`,
			[dbName]
		);

		if (checkDb.rows.length === 0) {
			console.log(`Creating database: ${dbName}`);
			await client.query(`CREATE DATABASE ${dbName}`);
			console.log("Database created successfully");
		} else {
			console.log("Database already exists");
		}
	} catch (error) {
		console.error("Error initializing database:", error);
		process.exit(1);
	} finally {
		await client.end();
	}

	// Run migrations
	try {
		console.log("Running migrations...");
		execSync("npm run migrate", { stdio: "inherit" });
		console.log("Migrations completed successfully");

		// Run seeders if in development
		if (process.env.NODE_ENV === "development") {
			console.log("Running seeders...");
			execSync("npm run seed", { stdio: "inherit" });
			console.log("Seeders completed successfully");
		}
	} catch (error) {
		console.error("Error running migrations/seeders:", error);
		process.exit(1);
	}
}

initializeDatabase().catch(console.error);
