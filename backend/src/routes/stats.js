const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const UserModel = require('../models/User');
const { PlatformConnection } = require('../models/PlatformConnection');
const { authenticateToken } = require('../middleware/auth');

const User = UserModel(sequelize, DataTypes);
const router = express.Router();

// Get dashboard stats
router.get('/', authenticateToken, async (req, res) => {
  try {
    // req.user is set by the authenticateToken middleware
    if (!req.user || !req.user.id) {
      console.log('No user found in request:', req.user);
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = req.user.id;
    console.log('Fetching stats for user:', userId);

    // For now, return mock data
    // In a real app, you would query your database for these stats
    const stats = {
      totalBlogPosts: 0,
      totalSocialPosts: 0,
      platformConnections: [],
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Error fetching stats' });
  }
});

module.exports = router;
