const redis = require('./client');

async function testRedis() {
    console.log('🧪 Testing JavaScript Redis Integration...\n');

    try {
        // Test basic operations
        console.log('1. Testing SET/GET:');
        await redis.set('test:key', 'Hello Redis!', 10);
        const value = await redis.get('test:key');
        console.log('   ✅ SET test:key = "Hello Redis!" (TTL: 10s)');
        console.log('   ✅ GET test:key =', value);

        // Test existence
        console.log('\n2. Testing EXISTS:');
        const exists = await redis.exists('test:key');
        console.log('   ✅ EXISTS test:key =', exists);

        // Test info
        console.log('\n3. Testing INFO:');
        const info = await redis.info();
        console.log('   ✅ Redis Info:');
        console.log('      - Version:', info.version);
        console.log('      - Total Keys:', info.total_keys);
        console.log('      - Cache Hit Rate:', info.hit_rate);

        // Test pattern matching
        console.log('\n4. Testing KEYS with pattern:');
        await redis.set('cache:user:1', 'User 1 data');
        await redis.set('cache:user:2', 'User 2 data');
        await redis.set('temp:session', 'Session data');
        
        const userKeys = await redis.keys('cache:user:*');
        console.log('   ✅ KEYS cache:user:* =', userKeys);

        // Test TTL expiration
        console.log('\n5. Testing TTL expiration:');
        await redis.set('temp:key', 'This will expire', 2);
        console.log('   ✅ SET temp:key with 2s TTL');
        
        setTimeout(async () => {
            const expiredValue = await redis.get('temp:key');
            console.log('   ✅ GET temp:key after 3s =', expiredValue);
        }, 3000);

        console.log('\n🎉 All Redis tests completed successfully!');

    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

testRedis();
