const jwt = require('jsonwebtoken');
const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const UserModel = require('../models/User');

const User = UserModel(sequelize, DataTypes);

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ error: 'Authentication token required' });
    }

    console.log('Verifying token:', token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);

    const user = await User.findByPk(decoded.userId); 
    console.log('Found user:', user ? user.id : 'none');

    if (!user) {
      console.log('User not found for id:', decoded.userId);
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = {
  authenticateToken
};
