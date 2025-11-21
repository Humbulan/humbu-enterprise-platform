const crypto = require('crypto');

class JWTManager {
    constructor() {
        this.secret = process.env.JWT_SECRET || 'humbu-enterprise-secret-key-2024';
        this.algorithm = 'HS256';
    }

    generateToken(payload, expiresIn = '24h') {
        const header = {
            alg: this.algorithm,
            typ: 'JWT'
        };

        const now = Math.floor(Date.now() / 1000);
        const expires = now + (expiresIn === '24h' ? 24 * 60 * 60 : parseInt(expiresIn));

        const payloadWithExp = {
            ...payload,
            iat: now,
            exp: expires
        };

        // Simple JWT implementation (in production use a library like jsonwebtoken)
        const headerBase64 = Buffer.from(JSON.stringify(header)).toString('base64url');
        const payloadBase64 = Buffer.from(JSON.stringify(payloadWithExp)).toString('base64url');
        
        const signature = crypto
            .createHmac('sha256', this.secret)
            .update(`${headerBase64}.${payloadBase64}`)
            .digest('base64url');

        return `${headerBase64}.${payloadBase64}.${signature}`;
    }

    verifyToken(token) {
        try {
            const [headerBase64, payloadBase64, signature] = token.split('.');
            
            const expectedSignature = crypto
                .createHmac('sha256', this.secret)
                .update(`${headerBase64}.${payloadBase64}`)
                .digest('base64url');

            if (signature !== expectedSignature) {
                throw new Error('Invalid signature');
            }

            const payload = JSON.parse(Buffer.from(payloadBase64, 'base64url').toString());
            
            if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
                throw new Error('Token expired');
            }

            return { valid: true, payload };
        } catch (error) {
            return { valid: false, error: error.message };
        }
    }

    decodeToken(token) {
        try {
            const [, payloadBase64] = token.split('.');
            return JSON.parse(Buffer.from(payloadBase64, 'base64url').toString());
        } catch (error) {
            return null;
        }
    }
}

module.exports = new JWTManager();
