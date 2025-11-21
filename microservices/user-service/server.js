const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 8201;

app.use(express.json());

// Health endpoints (define these FIRST)
app.get('/health', (req, res) => {
  res.json({
    service: 'user-service',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

app.get('/users/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'user-service',
        timestamp: new Date().toISOString(),
        features: ['list-users', 'register-user', 'health-check']
    });
});

// User Registration Endpoint (define BEFORE parameterized routes)
app.post('/users/register', (req, res) => {
    console.log('📝 User registration attempt:', req.body);

    const { username, email, password } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
        return res.status(400).json({
            error: 'Missing required fields',
            required: ['username', 'email', 'password'],
            received: req.body
        });
    }

    // Create new user (demo implementation)
    const newUser = {
        id: Date.now(), // Simple ID generation
        username: username,
        email: email,
        role: 'user',
        status: 'active',
        createdAt: new Date().toISOString(),
        message: 'User registered successfully via Humbu Platform!'
    };

    console.log('✅ New user registered:', newUser.username);
    res.status(201).json(newUser);
});

// User routes
app.get('/users', (req, res) => {
  res.json({
    users: [
      { id: 1, name: 'John Doe', email: 'john@humbu.store', role: 'admin' },
      { id: 2, name: 'Jane Smith', email: 'jane@humbu.store', role: 'user' }
    ],
    total: 2,
    timestamp: new Date().toISOString()
  });
});

// This should be LAST to avoid catching other routes
app.get('/users/:id', (req, res) => {
  // Only process if it's a numeric ID
  if (isNaN(req.params.id)) {
    return res.status(404).json({
      error: 'User not found',
      message: 'Use /users/health for service health check'
    });
  }
  
  res.json({
    id: parseInt(req.params.id),
    name: 'Demo User',
    email: 'demo@humbu.store',
    role: 'user',
    createdAt: new Date().toISOString()
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`👥 User Service running on port ${PORT}`);
});
