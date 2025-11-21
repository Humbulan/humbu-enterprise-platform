#!/bin/bash

echo "🚀 HUMBU PLATFORM - NATIVE DEPLOYMENT"
echo "===================================="

# Kill any existing services
pkill -f "uvicorn|node.*index.js" 2>/dev/null || true

# Start AI Agent Service
echo "🤖 Starting AI Agent Service..."
cd docker-deployment/ai-agent
python -m uvicorn main:app --host 0.0.0.0 --port 8000 &
AI_PID=$!
cd ../..

# Start BI API Service  
echo "📊 Starting BI API Service..."
cd docker-deployment/bi-api
python -m uvicorn main_with_ai_and_alerts:app --host 0.0.0.0 --port 8001 &
BI_PID=$!
cd ../..

# Start API Gateway
echo "🌐 Starting API Gateway..."
cd docker-deployment/api-gateway
node index.js &
GATEWAY_PID=$!
cd ../..

# Save PIDs for later management
echo $AI_PID > .ai-agent.pid
echo $BI_PID > .bi-api.pid  
echo $GATEWAY_PID > .api-gateway.pid

echo "⏳ Waiting for services to start..."
sleep 8

echo "🔍 Testing services..."
echo "1. AI Agent: $(curl -s -o /dev/null -w '%{http_code}' http://localhost:8000/health)"
echo "2. BI API: $(curl -s -o /dev/null -w '%{http_code}' http://localhost:8001/api/alerts)" 
echo "3. Gateway: $(curl -s -o /dev/null -w '%{http_code}' http://localhost:8102/health)"

echo ""
echo "🎉 NATIVE DEPLOYMENT COMPLETE!"
echo "=============================="
echo "🤖 AI Agent:    http://localhost:8000"
echo "📊 BI API:      http://localhost:8001" 
echo "🌐 API Gateway: http://localhost:8102"
echo ""
echo "📝 Process PIDs saved in .*.pid files"
echo "🛑 Stop with: ./stop-native.sh"
