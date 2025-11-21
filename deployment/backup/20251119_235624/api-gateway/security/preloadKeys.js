// Pre-load demo API keys for immediate testing
const apiKeys = require('./apiKeys');

// Clear any existing keys
apiKeys.keys.clear();

// Pre-generate demo keys
const demoKeys = [
    apiKeys.generateAPIKey('admin-demo-key', ['admin', 'read', 'write'], 365),
    apiKeys.generateAPIKey('read-only-demo', ['read'], 30),
    apiKeys.generateAPIKey('ci-cd-demo', ['admin', 'read'], 90)
];

console.log('🔑 PRE-LOADED DEMO API KEYS:');
demoKeys.forEach(key => {
    console.log(`   📋 ${key.name}: ${key.key}`);
    console.log(`      Secret: ${key.secret}`);
    console.log(`      Permissions: ${key.permissions.join(', ')}`);
});

module.exports = demoKeys;
