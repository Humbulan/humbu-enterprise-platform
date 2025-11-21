const sqlite = require('../../../libs/sqlite/client');

class User {
    static async create(username, email) {
        return await sqlite.createUser(username, email);
    }

    static async findById(id) {
        return await sqlite.getUserById(id);
    }

    static async findByUsername(username) {
        return await sqlite.getUserByUsername(username);
    }

    static async findAll() {
        return await sqlite.getAllUsers();
    }

    static async createSession(userId, expiresInHours = 24) {
        const sessionToken = require('crypto').randomBytes(32).toString('hex');
        return await sqlite.createSession(userId, sessionToken, expiresInHours);
    }

    static async validateSession(token) {
        return await sqlite.validateSession(token);
    }
}

module.exports = User;
