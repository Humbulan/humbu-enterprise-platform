const crypto = require('crypto');

class APIKeyManager {
    constructor() {
        this.keys = new Map(); // In production, store in database
    }

    generateAPIKey(name, permissions = ['read'], expiresInDays = 365) {
        const key = `hk_${crypto.randomBytes(32).toString('hex')}`;
        const secret = crypto.randomBytes(64).toString('hex');
        
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + expiresInDays);

        const keyData = {
            name,
            key,
            secretHash: this._hashSecret(secret),
            permissions,
            createdAt: new Date(),
            expiresAt,
            lastUsed: null,
            isActive: true
        };

        this.keys.set(key, keyData);
        
        return {
            key,
            secret, // Only returned once!
            ...keyData
        };
    }

    validateAPIKey(apiKey, apiSecret) {
        const keyData = this.keys.get(apiKey);
        
        if (!keyData || !keyData.isActive) {
            return { valid: false, error: 'Invalid API key' };
        }

        if (keyData.expiresAt < new Date()) {
            return { valid: false, error: 'API key expired' };
        }

        const secretHash = this._hashSecret(apiSecret);
        if (keyData.secretHash !== secretHash) {
            return { valid: false, error: 'Invalid API secret' };
        }

        // Update last used
        keyData.lastUsed = new Date();
        this.keys.set(apiKey, keyData);

        return { 
            valid: true, 
            permissions: keyData.permissions,
            name: keyData.name
        };
    }

    revokeAPIKey(apiKey) {
        const keyData = this.keys.get(apiKey);
        if (keyData) {
            keyData.isActive = false;
            this.keys.set(apiKey, keyData);
            return true;
        }
        return false;
    }

    listAPIKeys() {
        return Array.from(this.keys.values()).map(({ secretHash, ...key }) => key);
    }

    _hashSecret(secret) {
        return crypto.createHash('sha256').update(secret).digest('hex');
    }

    // Middleware for API key authentication
    middleware(requiredPermissions = []) {
        return async (req, res, next) => {
            const apiKey = req.headers['x-api-key'];
            const apiSecret = req.headers['x-api-secret'];

            if (!apiKey || !apiSecret) {
                return res.status(401).json({
                    error: 'Authentication required',
                    message: 'API key and secret are required'
                });
            }

            const validation = this.validateAPIKey(apiKey, apiSecret);
            
            if (!validation.valid) {
                return res.status(401).json({
                    error: 'Authentication failed',
                    message: validation.error
                });
            }

            // Check permissions
            if (requiredPermissions.length > 0) {
                const hasPermission = requiredPermissions.some(permission => 
                    validation.permissions.includes(permission)
                );
                
                if (!hasPermission) {
                    return res.status(403).json({
                        error: 'Insufficient permissions',
                        message: `Required: ${requiredPermissions.join(', ')}`
                    });
                }
            }

            // Add user info to request
            req.apiKey = {
                key: apiKey,
                name: validation.name,
                permissions: validation.permissions
            };

            next();
        };
    }
}

module.exports = new APIKeyManager();
