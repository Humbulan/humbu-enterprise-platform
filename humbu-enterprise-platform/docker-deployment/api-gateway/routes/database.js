const express = require('express');
const User = require('../models/User');
const CacheMetrics = require('../models/CacheMetrics');

const router = express.Router();

// User management routes
router.post('/users', async (req, res) => {
    try {
        const { username, email } = req.body;
        
        if (!username || !email) {
            return res.status(400).json({ error: 'Username and email are required' });
        }

        const userId = await User.create(username, email);
        res.status(201).json({ 
            message: 'User created successfully',
            user: { id: userId, username, email }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/users', async (req, res) => {
    try {
        const users = await User.findAll();
        res.json({ users });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            res.json({ user });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Session management routes
router.post('/sessions', async (req, res) => {
    try {
        const { username } = req.body;
        
        if (!username) {
            return res.status(400).json({ error: 'Username is required' });
        }

        const user = await User.findByUsername(username);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const sessionToken = await User.createSession(user.id);
        res.json({ 
            message: 'Session created successfully',
            session_token: sessionToken,
            user: { id: user.id, username: user.username }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/sessions/validate', async (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ error: 'Authorization token required' });
        }

        const user = await User.validateSession(token);
        if (user) {
            res.json({ 
                valid: true,
                user: { id: user.id, username: user.username }
            });
        } else {
            res.status(401).json({ valid: false, error: 'Invalid or expired session' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Cache analytics routes
router.get('/analytics/cache', async (req, res) => {
    try {
        const stats = await CacheMetrics.getOverallStats();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Database health check
router.get('/health', async (req, res) => {
    try {
        // Test database connection
        const users = await User.findAll();
        const stats = await CacheMetrics.getOverallStats();
        
        res.json({
            status: 'healthy',
            database: 'connected',
            total_users: users.length,
            cache_analytics: stats.overall
        });
    } catch (error) {
        res.status(500).json({
            status: 'degraded',
            database: 'error',
            error: error.message
        });
    }
});

module.exports = router;
