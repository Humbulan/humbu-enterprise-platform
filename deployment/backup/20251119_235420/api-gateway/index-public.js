const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Use 127.0.0.1 instead of localhost for better reliability
const AI_AGENT_URL = 'http://127.0.0.1:8100/chat';
const BI_API_URL = 'http://127.0.0.1:8101/api/alerts';

console.log('🚀 Humbu Platform Starting in PUBLIC mode');
console.log(`🤖 AI Service: ${AI_AGENT_URL}`);
console.log(`📊 BI Service: ${BI_API_URL}`);

// Health endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Humbu Enterprise Platform - Public Deployment',
    environment: 'public',
    services: {
      ai_agent: AI_AGENT_URL,
      bi_api: BI_API_URL
    },
    timestamp: new Date().toISOString()
  });
});

// Platform info
app.get('/api/platform', (req, res) => {
  res.json({
    name: 'Humbu Enterprise Platform',
    version: '1.0.0', 
    status: 'unified',
    environment: 'public',
    deployment: 'cloudflare-tunnel',
    services: {
      ai_agent: AI_AGENT_URL,
      bi_api: BI_API_URL,
      api_gateway: 'https://abc-its-deviation-fate.trycloudflare.com'
    }
  });
});

// AI Service proxy with better error handling
app.post('/api/v1/ai/chat', async (req, res) => {
  try {
    console.log(`📡 Proxying AI request to: ${AI_AGENT_URL}`);
    
    const response = await fetch(AI_AGENT_URL, { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
      timeout: 10000 // 10 second timeout
    });

    if (!response.ok) {
      throw new Error(`AI service status: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    res.json({
      ...data,
      routed_through: 'api-gateway',
      deployment: 'public'
    });
  } catch (error) {
    console.error('❌ AI Gateway error:', error.message);
    res.status(500).json({
      error: 'Failed to reach AI service',
      message: error.message,
      ai_service_url: AI_AGENT_URL,
      timestamp: new Date().toISOString()
    });
  }
});

// BI Service proxy with better error handling
app.get('/api/v1/bi/alerts', async (req, res) => {
  try {
    console.log(`📊 Proxying BI request to: ${BI_API_URL}`);
    
    const response = await fetch(BI_API_URL, {
      timeout: 10000 // 10 second timeout
    });
    
    if (!response.ok) {
      throw new Error(`BI service status: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    res.json({
      ...data,
      routed_through: 'api-gateway', 
      deployment: 'public'
    });
  } catch (error) {
    console.error('❌ BI Gateway error:', error.message);
    res.status(500).json({
      error: 'Failed to reach BI service',
      message: error.message,
      bi_service_url: BI_API_URL,
      timestamp: new Date().toISOString()
    });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Humbu Enterprise Platform - Public Deployment via Cloudflare',
    environment: 'public',
    public_url: 'https://abc-its-deviation-fate.trycloudflare.com',
    endpoints: {
      health: 'GET /health',
      platform: 'GET /api/platform', 
      ai_chat: 'POST /api/v1/ai/chat',
      bi_alerts: 'GET /api/v1/bi/alerts'
    }
  });
});

const PORT = 8102;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 API Gateway running on http://0.0.0.0:${PORT}`);
  console.log('🎯 Public deployment ready!');
  console.log('🌐 Public URL: https://abc-its-deviation-fate.trycloudflare.com');
});
