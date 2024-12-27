const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const UserModel = require('../models/User');
const { PlatformConnection } = require('../models/PlatformConnection');

const User = UserModel(sequelize, DataTypes);
const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const user = await User.create({
      email,
      password,
      name
    });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY
    });

    res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Error creating user' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    console.log("Login attempt - Request body:", req.body);
    
    const { email, password } = req.body;
    
    if (!email || !password) {
      console.log("Missing credentials - Email:", !!email, "Password:", !!password);
      return res.status(400).json({ error: 'Email and password are required' });
    }

    console.log("Searching for user with email:", email);
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      console.log("User not found with email:", email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log("User found, comparing passwords");
    console.log("Input password:", password);
    console.log("Stored password:", user.password);
    
    if (password !== user.password) {
      console.log("Password mismatch");
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log("Password matched, generating token");
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY
    });

    console.log("Login successful for user:", user.email);
    res.json({ 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name 
      } 
    });
  } catch (error) {
    console.error('Login error - Full error:', error);
    res.status(500).json({ error: 'Error logging in' });
  }
});

// Verify token and get user info
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    res.json({ 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name 
      } 
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// OAuth routes for each platform
const platforms = ['webflow', 'wordpress', 'medium', 'linkedin', 'twitter'];

platforms.forEach(platform => {
  // Initialize OAuth
  router.get(`/${platform}`, passport.authenticate(platform, {
    scope: getPlatformScope(platform)
  }));

  // OAuth callback
  router.get(`/${platform}/callback`, 
    passport.authenticate(platform, { session: false }),
    async (req, res) => {
      try {
        console.log(`OAuth callback for ${platform} - Request body:`, req.body);
        const { user, accessToken, refreshToken } = req;

        await PlatformConnection.create({
          userId: user.id,
          platform: platform.toUpperCase(),
          accessToken,
          refreshToken,
          tokenExpiry: calculateTokenExpiry(platform),
          platformUserId: req.profile?.id,
          platformUserName: req.profile?.username
        });

        console.log(`OAuth callback successful for ${platform} - Redirecting to dashboard`);
        res.redirect('/dashboard');
      } catch (error) {
        console.error(`OAuth callback error for ${platform} - Full error:`, error);
        res.redirect('/error');
      }
    }
  );
});

function getPlatformScope(platform) {
  const scopes = {
    webflow: ['read_sites'],
    wordpress: ['posts', 'read'],
    medium: ['basicProfile', 'publishPost'],
    linkedin: ['r_liteprofile', 'w_member_social'],
    twitter: ['tweet.read', 'tweet.write', 'users.read']
  };
  return scopes[platform] || [];
}

function calculateTokenExpiry(platform) {
  const expiryHours = {
    webflow: 24,
    wordpress: 24,
    medium: 24,
    linkedin: 60,
    twitter: 24
  };
  
  const hours = expiryHours[platform] || 24;
  return new Date(Date.now() + hours * 60 * 60 * 1000);
}

module.exports = router;
