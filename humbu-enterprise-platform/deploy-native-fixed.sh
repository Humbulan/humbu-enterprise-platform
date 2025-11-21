#!/bin/bash

echo "🚀 HUMBU PLATFORM - NATIVE DEPLOYMENT (FIXED PORTS)"
echo "=================================================="

# Kill any existing services
pkill -f "uvicorn" 2>/dev/null || true
pkill -f "node.*index.js" 2>/dev/null || true
sleep 2

# Use different ports to avoid conflicts
AI_PORT=8100
BI_PORT=8101  
GATEWAY_PORT=8102

echo "📡 Using ports: AI=$AI_PORT, BI=$BI_PORT, Gateway=$GATEWAY_PORT"

# Start AI Agent Service
echo "🤖 Starting AI Agent Service on port $AI_PORT..."
cd docker-deployment/ai-agent
python -m uvicorn main:app --host 0.0.0.0 --port $AI_PORT &
AI_PID=$!
cd ../..

# Start BI API Service  
echo "📊 Starting BI API Service on port $BI_PORT..."
cd docker-deployment/bi-api
python -m uvicorn main_with_ai_and_alerts:app --host 0.0.0.0 --port $BI_PORT &
BI_PID=$!
cd ../..

# Wait a moment for Python services to start
sleep 3

# Start API Gateway with updated configuration
echo "🌐 Starting API Gateway on port $GATEWAY_PORT..."
cd docker-deployment/api-gateway

# Create a temporary gateway config with new ports
cat > index-fixed.js << 'CONFIG'
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Fixed port configuration
const AI_AGENT_URL = 'http://localhost:8100/chat';
const BI_API_URL = 'http://localhost:8101/api/alerts';

console.log('🚀 Humbu Platform Starting in NATIVE mode (Fixed Ports)');
console.log(\`🤖 AI Service: \${AI_AGENT_URL}\`);
console.log(\`📊 BI Service: \${BI_API_URL}\`);

// Health endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Humbu Enterprise Platform - Native Deployment (Fixed)',
    environment: 'native',
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
    environment: 'native',
    deployment: 'native-processes',
    services: {
      ai_agent: AI_AGENT_URL,
      bi_api: BI_API_URL,
      api_gateway: 'http://localhost:8102'
    }
  });
});

// AI Service proxy
app.post('/api/v1/ai/chat', async (req, res) => {
  try {
    console.log(\`📡 Proxying AI request to: \${AI_AGENT_URL}\`);
    
    const response = await fetch(AI_AGENT_URL, { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });

    if (!response.ok) throw new Error(\`AI service status: \${response.status}\`);

    const data = await response.json();
    res.json({
      ...data,
      routed_through: 'api-gateway',
      deployment: 'native'
    });
  } catch (error) {
    console.error('❌ AI Gateway error:', error.message);
    res.status(500).json({
      error: 'Failed to reach AI service',
      message: error.message,
      ai_service_url: AI_AGENT_URL
    });
  }
});

// BI Service proxy
app.get('/api/v1/bi/alerts', async (req, res) => {
  try {
    console.log(\`📊 Proxying BI request to: \${BI_API_URL}\`);
    
    const response = await fetch(BI_API_URL);
    
    if (!response.ok) throw new Error(\`BI service status: \${response.status}\`);

    const data = await response.json();
    res.json({
      ...data,
      routed_through: 'api-gateway', 
      deployment: 'native'
    });
  } catch (error) {
    console.error('❌ BI Gateway error:', error.message);
    res.status(500).json({
      error: 'Failed to reach BI service',
      message: error.message,
      bi_service_url: BI_API_URL
    });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Humbu Enterprise Platform - Native Deployment (Fixed Ports)',
    environment: 'native',
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
  console.log(\`🚀 API Gateway running on http://0.0.0.0:\${PORT}\`);
  console.log('🎯 Native deployment ready!');
});
CONFIG

node index-fixed.js &
GATEWAY_PID=$!
cd ../..

# Save PIDs for later management
echo $AI_PID > .ai-agent.pid
echo $BI_PID > .bi-api.pid  
echo $GATEWAY_PID > .api-gateway.pid

echo "⏳ Waiting for services to start..."
sleep 5

echo "🔍 Testing services..."
echo "1. AI Agent: $(curl -s -o /dev/null -w '%{http_code}' http://localhost:8100/health || echo 'DOWN')"
echo "2. BI API: $(curl -s -o /dev/null -w '%{http_code}' http://localhost:8101/api/alerts || echo 'DOWN')" 
echo "3. Gateway: $(curl -s -o /dev/null -w '%{http_code}' http://localhost:8102/health || echo 'DOWN')"

echo ""
echo "🎉 NATIVE DEPLOYMENT COMPLETE!"
echo "=============================="
echo "🤖 AI Agent:    http://localhost:8100"
echo "📊 BI API:      http://localhost:8101" 
echo "🌐 API Gateway: http://localhost:8102"
echo ""
echo "📝 Process PIDs saved in .*.pid files"
echo "🛑 Stop with: pkill -f 'uvicorn|node.*index-fixed'"
