const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Environment-aware AI service configuration
const AI_AGENT_HOST = process.env.AI_AGENT_HOST || 'ai-agent'; // Default for Docker
const AI_AGENT_PORT = process.env.AI_AGENT_PORT || '8000';     // Default port
const AI_AGENT_URL = `http://${AI_AGENT_HOST}:${AI_AGENT_PORT}/chat`;

console.log(`🚀 AI Service configured: ${AI_AGENT_URL}`);
console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);

// Simple health endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Humbu Enterprise Platform Gateway',
    ai_service_url: AI_AGENT_URL,
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Simple platform info
app.get('/api/platform', (req, res) => {
  res.json({
    name: 'Humbu Enterprise Platform',
    version: '1.0.0',
    status: 'unified',
    environment: process.env.NODE_ENV || 'development',
    ai_service: AI_AGENT_URL,
    services: ['ai-agent', 'web-frontend', 'utility-api'],
    unified: true
  });
});

// Manual proxy for AI service - NOW ENVIRONMENT AWARE
app.post('/api/v1/ai/chat', async (req, res) => {
  try {
    console.log(`📡 Proxying request to: ${AI_AGENT_URL}`);
    
    const response = await fetch(AI_AGENT_URL, { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body)
    });

    if (!response.ok) {
      throw new Error(`AI service responded with status: ${response.status}`);
    }

    const data = await response.json();
    res.json({
      ...data,
      routed_through: 'api-gateway',
      ai_service: AI_AGENT_URL
    });
  } catch (error) {
    console.error('❌ Gateway routing error:', error.message);
    res.status(500).json({
      error: 'Failed to reach AI service',
      message: error.message,
      ai_service_url: AI_AGENT_URL,
      suggestion: 'Check if AI Agent is running and accessible'
    });
  }
});

// Direct health check for AI service
app.get('/api/v1/ai/health', async (req, res) => {
  try {
    const response = await fetch(`http://${AI_AGENT_HOST}:${AI_AGENT_PORT}/health`);
    const data = await response.json();
    res.json({
      ai_service: 'healthy',
      ai_url: `http://${AI_AGENT_HOST}:${AI_AGENT_PORT}`,
      ...data
    });
  } catch (error) {
    res.status(503).json({
      ai_service: 'unhealthy',
      error: error.message,
      ai_url: `http://${AI_AGENT_HOST}:${AI_AGENT_PORT}`
    });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Humbu Enterprise Platform - Unified Gateway',
    environment: process.env.NODE_ENV || 'development',
    ai_service: AI_AGENT_URL,
    endpoints: {
      health: 'GET /health',
      platform: 'GET /api/platform',
      ai_chat: 'POST /api/v1/ai/chat',
      ai_health: 'GET /api/v1/ai/health'
    }
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 API Gateway running on http://0.0.0.0:${PORT}`);
  console.log(`🎯 AI Service URL: ${AI_AGENT_URL}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('✅ Environment-aware routing enabled!');
});
