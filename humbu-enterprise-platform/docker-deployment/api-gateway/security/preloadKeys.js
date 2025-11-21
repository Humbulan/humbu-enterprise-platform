// Pre-load demo API keys for immediate testing
const apiKeys = require('./apiKeys');

// Clear any existing keys
if (apiKeys.keys && apiKeys.keys.clear) {
    apiKeys.keys.clear();
}

// Pre-generate demo keys
const demoKeys = [
    {
        name: 'admin-demo-key',
        key: 'hk_admin_demo_key', 
        secret: 'demo_secret_123',
        permissions: ['admin', 'read', 'write'],
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    },
    {
        name: 'read-only-demo',
        key: 'hk_read_only_key',
        secret: 'read_secret_456', 
        permissions: ['read'],
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    }
];

// Manually add keys to the API key manager
demoKeys.forEach(keyData => {
    if (apiKeys.keys) {
        apiKeys.keys.set(keyData.key, {
            name: keyData.name,
            key: keyData.key,
            secretHash: require('crypto').createHash('sha256').update(keyData.secret).digest('hex'),
            permissions: keyData.permissions,
            createdAt: new Date(),
            expiresAt: keyData.expiresAt,
            lastUsed: null,
            isActive: true
        });
    }
});

console.log('🔑 PRE-LOADED DEMO API KEYS:');
demoKeys.forEach(key => {
    console.log(`   📋 ${key.name}: ${key.key}`);
    console.log(`      Secret: ${key.secret}`);
    console.log(`      Permissions: ${key.permissions.join(', ')}`);
});

module.exports = demoKeys;
