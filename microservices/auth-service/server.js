const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 8202;

app.use(express.json());

// Health endpoint
app.get('/health', (req, res) => {
  res.json({
    service: 'auth-service',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Authentication endpoints
app.post('/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  // Demo authentication
  if (username === 'admin' && password === 'password') {
    const token = jwt.sign(
      { userId: 1, username: 'admin', role: 'admin' },
      process.env.JWT_SECRET || 'demo_secret',
      { expiresIn: '24h' }
    );
    
    res.json({
      success: true,
      token,
      user: { id: 1, username: 'admin', role: 'admin' }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
});

app.post('/auth/verify', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ valid: false, message: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'demo_secret');
    res.json({ valid: true, user: decoded });
  } catch (error) {
    res.status(401).json({ valid: false, message: 'Invalid token' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🔐 Auth Service running on port ${PORT}`);
});
