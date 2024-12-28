const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

const authenticateToken = async (req, res, next) => {
	try {
		const authHeader = req.headers["authorization"];
		const token = authHeader && authHeader.split(" ")[1];

		if (!token) {
			return res.status(401).json({ error: "Authentication token required" });
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findByPk(decoded.userId);

		if (!user) {
			return res.status(401).json({ error: "User not found" });
		}

		req.user = user;
		next();
	} catch (error) {
		return res.status(401).json({ error: "Invalid authentication token" });
	}
};

module.exports = {
	authenticateToken,
};
