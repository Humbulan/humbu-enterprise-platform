const express = require('express');
const jwt = require('../security/jwt');
const rateLimit = require('../middleware/rateLimit');
const apiKeys = require('../security/apiKeys');
const UserEvents = require('../events/UserEvents');

const router = express.Router();

// Apply rate limiting to auth routes
router.use(rateLimit.middleware('api-auth'));

// Login endpoint
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password required' });
        }

        // Mock authentication - in production, verify against database
        const user = { 
            id: 1, 
            username, 
            email: `${username}@humbu.store`,
            roles: ['user']
        };

        // Generate JWT token
        const token = jwt.generateToken({
            userId: user.id,
            username: user.username,
            roles: user.roles
        }, '24h');

        // Send Kafka event
        await UserEvents.userLoggedIn(user.id, token);

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                roles: user.roles
            },
            expiresIn: '24h'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Token verification endpoint
router.post('/verify', async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ error: 'Token required' });
        }

        const verification = jwt.verifyToken(token);

        if (verification.valid) {
            res.json({
                valid: true,
                user: {
                    userId: verification.payload.userId,
                    username: verification.payload.username,
                    roles: verification.payload.roles
                }
            });
        } else {
            res.status(401).json({
                valid: false,
                error: verification.error
            });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API Key management endpoints
router.post('/api-keys/generate', apiKeys.middleware(['admin']), async (req, res) => {
    try {
        const { name, permissions, expiresInDays } = req.body;

        const apiKey = apiKeys.generateAPIKey(
            name || 'New API Key',
            permissions || ['read'],
            expiresInDays || 365
        );

        res.status(201).json({
            message: 'API key generated successfully',
            apiKey: {
                name: apiKey.name,
                key: apiKey.key,
                secret: apiKey.secret, // Only returned once!
                permissions: apiKey.permissions,
                expiresAt: apiKey.expiresAt
            },
            warning: 'Store the secret securely - it will not be shown again'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/api-keys', apiKeys.middleware(['admin']), async (req, res) => {
    try {
        const keys = apiKeys.listAPIKeys();
        res.json({ apiKeys: keys });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/api-keys/:key', apiKeys.middleware(['admin']), async (req, res) => {
    try {
        const { key } = req.params;
        const revoked = apiKeys.revokeAPIKey(key);
        
        if (revoked) {
            res.json({ message: 'API key revoked successfully' });
        } else {
            res.status(404).json({ error: 'API key not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Protected user profile endpoint
router.get('/profile', apiKeys.middleware(['read']), async (req, res) => {
    try {
        // Mock user data - in production, fetch from database
        const user = {
            id: 1,
            username: 'demo-user',
            email: 'demo@humbu.store',
            profile: {
                name: 'Demo User',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
                joined: new Date().toISOString()
            },
            apiKey: req.apiKey // Information about the calling API key
        };

        res.json({ user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
