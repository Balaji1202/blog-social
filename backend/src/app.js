const express = require("express");
const cors = require("cors");
const session = require("express-session");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const winston = require("winston");
const passport = require("passport");
const { validateOAuthConfig } = require("./config/oauth");
const { sequelize, PlatformConnection } = require("./config/database");
const { authenticateToken } = require("./middleware/auth");

// Import routes
const authRoutes = require("./routes/auth");
const oauthRoutes = require("./routes/oauth");
const blogsRoutes = require("./routes/blogs");
const socialRoutes = require("./routes/social");
const statsRoutes = require("./routes/stats");

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

// Security middleware
app.use(helmet());
app.use(
	rateLimit({
		windowMs: 15 * 60 * 1000, // 15 minutes
		max: 100, // limit each IP to 100 requests per windowMs
	})
);

// Session configuration
app.use(
	session({
		secret: process.env.SESSION_SECRET || "your-secret-key",
		resave: false,
		saveUninitialized: false,
		cookie: {
			secure: process.env.NODE_ENV === "production",
			httpOnly: true,
			maxAge: 24 * 60 * 60 * 1000, // 24 hours
		},
	})
);

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
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/oauth", oauthRoutes);
app.use("/api/blogs", blogsRoutes);
app.use("/api/social", socialRoutes);
app.use("/api/stats", statsRoutes);

// Platform connections routes
app.get("/api/platform-connections", authenticateToken, async (req, res) => {
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
	authenticateToken,
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
	res.status(500).json({ error: "Something went wrong!" });
});

module.exports = app;
