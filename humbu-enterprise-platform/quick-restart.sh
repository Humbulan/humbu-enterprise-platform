#!/bin/bash

echo "🚀 QUICK RESTART - HUMBU PLATFORM"
echo "================================"

echo "1. Stopping existing services..."
pkill -f "uvicorn" 2>/dev/null && echo "✅ Stopped Python services" || echo "ℹ️ No Python services running"
pkill -f "node" 2>/dev/null && echo "✅ Stopped Node services" || echo "ℹ️ No Node services running"
sleep 2

echo ""
echo "2. Starting fresh deployment..."
cd ~/humbu-enterprise-platform/humbu-enterprise-platform

# Start AI Agent
cd docker-deployment/ai-agent
python -m uvicorn main:app --host 0.0.0.0 --port 8100 &
echo "✅ AI Agent started"

# Start BI API
cd ../bi-api
python -m uvicorn main_with_ai_and_alerts:app --host 0.0.0.0 --port 8101 &
echo "✅ BI API started"

# Start Gateway
cd ../api-gateway
node index-public.js &
echo "✅ API Gateway started"

echo ""
echo "⏳ Waiting for services to start..."
sleep 5

echo ""
echo "3. Testing platform..."
curl -s http://localhost:8102/health > /dev/null && echo "✅ Platform running successfully!" || {
    echo "❌ Platform failed to start"
    echo "💡 Check manually: curl http://localhost:8102/health"
}

echo ""
echo "🎯 KEEP THIS SESSION RUNNING!"
echo "🌐 The tunnel in main session will now work"
