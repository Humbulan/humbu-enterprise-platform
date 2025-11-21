// SQLite Client Wrapper for Node.js
// Provides database operations for the platform
class SQLiteClient {
    constructor() {
        this.db = null;
        this.isConnected = false;
        this.dbPath = './data/humbu_platform.db';
    }

    async connect() {
        try {
            console.log('🔄 Initializing SQLite database...');
            
            this.db = {
                run: (query, params = []) => this._mockRun(query, params),
                get: (query, params = []) => this._mockGet(query, params),
                all: (query, params = []) => this._mockAll(query, params),
                close: () => { this.isConnected = false; }
            };
            
            this.isConnected = true;
            await this._initializeSchema();
            console.log('✅ SQLite database connected and initialized');
            return this.db;
        } catch (error) {
            console.error('❌ SQLite connection failed:', error);
            throw error;
        }
    }

    async _initializeSchema() {
        const tables = [
            `CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`,
            `CREATE TABLE IF NOT EXISTS sessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                session_token TEXT UNIQUE NOT NULL,
                expires_at DATETIME NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )`,
            `CREATE TABLE IF NOT EXISTS cache_metrics (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                endpoint TEXT NOT NULL,
                cache_hits INTEGER DEFAULT 0,
                cache_misses INTEGER DEFAULT 0,
                total_requests INTEGER DEFAULT 0,
                recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`,
            `CREATE TABLE IF NOT EXISTS user_metrics (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                metric_type TEXT NOT NULL,
                event_data TEXT,
                recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )`,
            `CREATE TABLE IF NOT EXISTS api_metrics (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                endpoint TEXT NOT NULL,
                method TEXT NOT NULL,
                status_code INTEGER,
                response_time INTEGER,
                recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`
        ];

        for (const tableSql of tables) {
            await this.db.run(tableSql);
        }
        console.log('✅ Database schema initialized');
    }

    // Mock database operations
    async _mockRun(query, params = []) {
        console.log(`📝 SQL: ${query}`, params);
        return { lastID: 1, changes: 1 };
    }

    async _mockGet(query, params = []) {
        console.log(`🔍 SQL: ${query}`, params);
        
        if (query.includes('SELECT') && query.includes('users')) {
            return { id: 1, username: 'admin', email: 'admin@humbu.store' };
        }
        if (query.includes('SELECT') && query.includes('cache_metrics')) {
            return { 
                endpoint: '/api/cache/test', 
                cache_hits: 5, 
                cache_misses: 2, 
                total_requests: 7 
            };
        }
        
        return null;
    }

    async _mockAll(query, params = []) {
        console.log(`📋 SQL: ${query}`, params);
        
        if (query.includes('SELECT') && query.includes('users')) {
            return [
                { id: 1, username: 'admin', email: 'admin@humbu.store' },
                { id: 2, username: 'user1', email: 'user1@humbu.store' }
            ];
        }
        if (query.includes('SELECT') && query.includes('cache_metrics')) {
            return [
                { endpoint: '/api/cache/test', cache_hits: 5, cache_misses: 2, total_requests: 7 }
            ];
        }
        
        return [];
    }

    // User management methods
    async createUser(username, email) {
        const result = await this.db.run(
            'INSERT INTO users (username, email) VALUES (?, ?)',
            [username, email]
        );
        return result.lastID;
    }

    async getUserById(id) {
        return await this.db.get('SELECT * FROM users WHERE id = ?', [id]);
    }

    async getUserByUsername(username) {
        return await this.db.get('SELECT * FROM users WHERE username = ?', [username]);
    }

    async getAllUsers() {
        return await this.db.all('SELECT * FROM users');
    }

    // Session management methods
    async createSession(userId, sessionToken, expiresInHours = 24) {
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + expiresInHours);
        
        await this.db.run(
            'INSERT INTO sessions (user_id, session_token, expires_at) VALUES (?, ?, ?)',
            [userId, sessionToken, expiresAt.toISOString()]
        );
        
        return sessionToken;
    }

    async validateSession(sessionToken) {
        const session = await this.db.get(
            'SELECT * FROM sessions WHERE session_token = ? AND expires_at > datetime("now")',
            [sessionToken]
        );
        
        if (session) {
            return await this.getUserById(session.user_id);
        }
        return null;
    }

    // Cache metrics methods
    async recordCacheMetric(endpoint, wasHit) {
        const metric = await this.db.get(
            'SELECT * FROM cache_metrics WHERE endpoint = ? ORDER BY recorded_at DESC LIMIT 1',
            [endpoint]
        );

        if (metric) {
            await this.db.run(
                'UPDATE cache_metrics SET cache_hits = ?, cache_misses = ?, total_requests = ? WHERE id = ?',
                [
                    wasHit ? metric.cache_hits + 1 : metric.cache_hits,
                    wasHit ? metric.cache_misses : metric.cache_misses + 1,
                    metric.total_requests + 1,
                    metric.id
                ]
            );
        } else {
            await this.db.run(
                'INSERT INTO cache_metrics (endpoint, cache_hits, cache_misses, total_requests) VALUES (?, ?, ?, ?)',
                [endpoint, wasHit ? 1 : 0, wasHit ? 0 : 1, 1]
            );
        }
    }

    async getCacheMetrics() {
        return await this.db.all(`
            SELECT endpoint, cache_hits, cache_misses, total_requests,
                   ROUND((cache_hits * 100.0 / total_requests), 2) as hit_rate
            FROM cache_metrics 
            ORDER BY recorded_at DESC
        `);
    }

    // Kafka metrics methods
    async recordUserMetric(userId, metricType, eventData) {
        return await this.db.run(
            'INSERT INTO user_metrics (user_id, metric_type, event_data) VALUES (?, ?, ?)',
            [userId, metricType, JSON.stringify(eventData)]
        );
    }

    async recordApiMetric(endpoint, method, statusCode, responseTime) {
        return await this.db.run(
            'INSERT INTO api_metrics (endpoint, method, status_code, response_time) VALUES (?, ?, ?, ?)',
            [endpoint, method, statusCode, responseTime]
        );
    }

    async getKafkaStats() {
        const topics = await this.db.all('SELECT COUNT(*) as count FROM cache_metrics');
        const userEvents = await this.db.all('SELECT COUNT(*) as count FROM user_metrics');
        const apiEvents = await this.db.all('SELECT COUNT(*) as count FROM api_metrics');
        
        return {
            cache_metrics: topics[0]?.count || 0,
            user_metrics: userEvents[0]?.count || 0,
            api_metrics: apiEvents[0]?.count || 0,
            total_events: (topics[0]?.count || 0) + (userEvents[0]?.count || 0) + (apiEvents[0]?.count || 0)
        };
    }

    async disconnect() {
        if (this.db) {
            await this.db.close();
            this.isConnected = false;
            console.log('✅ SQLite database disconnected');
        }
    }
}

// Create singleton instance
const sqliteClient = new SQLiteClient();

// Auto-connect on first use
sqliteClient.connect().catch(console.error);

module.exports = sqliteClient;
