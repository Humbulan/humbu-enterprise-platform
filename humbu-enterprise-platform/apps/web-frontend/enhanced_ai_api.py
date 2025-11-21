#!/usr/bin/env python3
from flask import Flask, jsonify, request
from flask_cors import CORS
from functools import wraps
import random
from datetime import datetime

app = Flask(__name__)
CORS(app)

# API Authentication
API_KEY = "PREMIUM_KEY_A1B2C3D4"

def require_api_key(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({"error": "Authorization header missing"}), 401
        token = auth_header.split(' ')[1]
        if token != API_KEY:
            return jsonify({"error": "Invalid API Key"}), 401
        return f(*args, **kwargs)
    return decorated

@app.route('/')
def home():
    return jsonify({"message": "🤖 Humbu AI API", "status": "active"})

@app.route('/api/ai/insights')
@require_api_key
def insights():
    return jsonify({
        "insights": [
            "📈 Premium clients generate 65% of revenue",
            "🚀 E-commerce growth: 25% this quarter", 
            "💡 AI services show 40% growth potential"
        ],
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/ai/customer-segments')
@require_api_key  
def segments():
    return jsonify({
        "segments": [
            {"name": "Premium", "count": 45, "revenue": 65},
            {"name": "Small Business", "count": 120, "revenue": 25},
            {"name": "Startups", "count": 35, "revenue": 10}
        ]
    })

@app.route('/api/stats')
@require_api_key
def stats():
    return jsonify({
        "customers": 200,
        "revenue": 62000,
        "growth": "18%"
    })

if __name__ == '__main__':
    print("🚀 AI API Starting on port 8001...")
    app.run(host='0.0.0.0', port=8001, debug=False)
