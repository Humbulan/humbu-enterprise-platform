#!/bin/bash

echo "🌐 DEPLOYING DIRECT PUBLIC ACCESS"
echo "================================"

# Stop existing services
pkill -f "uvicorn" 2>/dev/null || true
pkill -f "node" 2>/dev/null || true
sleep 2

# Start AI Agent on port 8100
echo "🤖 Starting AI Agent (port 8100)..."
cd docker-deployment/ai-agent
python -m uvicorn main:app --host 0.0.0.0 --port 8100 &

# Start BI API on port 8101
echo "📊 Starting BI API (port 8101)..."
cd ../bi-api
python -m uvicorn main_with_ai_and_alerts:app --host 0.0.0.0 --port 8101 &

# Start Gateway on port 8102
echo "🌐 Starting Gateway (port 8102)..."
cd ../api-gateway
node index-public.js &

echo "⏳ Waiting for services..."
sleep 5

echo "🎯 SERVICES RUNNING:"
echo "  AI Agent:    http://localhost:8100"
echo "  BI API:      http://localhost:8101"
echo "  Gateway:     http://localhost:8102"
echo ""
echo "🌐 Public URLs via Cloudflare:"
echo "  Main:        https://abc-its-deviation-fate.trycloudflare.com"
echo "  AI Direct:   (would need separate tunnel)"
echo "  BI Direct:   (would need separate tunnel)"
