require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const winston = require("winston");
const passport = require("passport");
const session = require("express-session");
const { validateOAuthConfig } = require("./config/oauth");
const { sequelize, PlatformConnection } = require("./config/database");

// Import routes
const authRoutes = require("./routes/auth");
const blogRoutes = require("./routes/blogs");
const socialRoutes = require("./routes/social");
const statsRoutes = require("./routes/stats");
const oauthRoutes = require("./routes/oauth");

// Create Express app
const app = express();

// Configure logger
const logger = winston.createLogger({
	level: "info",
	format: winston.format.json(),
	transports: [
		new winston.transports.File({ filename: "error.log", level: "error" }),
		new winston.transports.File({ filename: "combined.log" }),
	],
});

if (process.env.NODE_ENV !== "production") {
	logger.add(
		new winston.transports.Console({
			format: winston.format.simple(),
		})
	);
}

// Validate OAuth configuration on startup
validateOAuthConfig();

// Middleware
app.use(
	cors({
		origin: process.env.FRONTEND_URL || "http://localhost:3000",
		credentials: true,
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
	})
);
app.use(express.json());
app.use(helmet());
app.use(
	rateLimit({
		windowMs: 15 * 60 * 1000, // 15 minutes
		max: 100, // Limit each IP to 100 requests per windowMs
	})
);
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		cookie: {
			secure: process.env.NODE_ENV === "production",
			httpOnly: true,
			maxAge: 24 * 60 * 60 * 1000, // 24 hours
		},
	})
);
app.use(passport.initialize());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/social", socialRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/oauth", oauthRoutes);

// Platform connections routes
app.get("/api/platform-connections", authenticateUser, async (req, res) => {
	try {
		const connections = await PlatformConnection.findAll({
			where: { userId: req.user.id },
		});
		res.json(connections);
	} catch (error) {
		logger.error("Error fetching platform connections:", error);
		res.status(500).json({ error: "Failed to fetch platform connections" });
	}
});

app.post(
	"/api/platform-connections/:platform/disconnect",
	authenticateUser,
	async (req, res) => {
		try {
			const { platform } = req.params;
			await PlatformConnection.update(
				{ connected: false },
				{
					where: {
						userId: req.user.id,
						platform,
					},
				}
			);
			res.json({ message: "Platform disconnected successfully" });
		} catch (error) {
			logger.error("Error disconnecting platform:", error);
			res.status(500).json({ error: "Failed to disconnect platform" });
		}
	}
);

// Error handling middleware
app.use((err, req, res, next) => {
	logger.error(err.stack);
	res.status(500).send("Something broke!");
});

// Sync database and start server
sequelize.sync().then(() => {
	const PORT = process.env.PORT || 3001;
	app.listen(PORT, async () => {
		try {
			await sequelize.authenticate();
			logger.info("Database connection has been established successfully.");
			logger.info(`Server is running on port ${PORT}`);
		} catch (error) {
			logger.error("Unable to connect to the database:", error);
		}
	});
});

module.exports = app;
