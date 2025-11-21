#!/bin/bash

echo "🔄 COMPLETE RESTART - HUMBU PLATFORM & TUNNEL"
echo "============================================"

echo "1. 🛑 Stopping everything..."
pkill cloudflared 2>/dev/null && echo "✅ Stopped tunnel" || echo "ℹ️ No tunnel running"
pkill -f "uvicorn" 2>/dev/null && echo "✅ Stopped platform" || echo "ℹ️ No platform running"
sleep 3

echo ""
echo "2. 🤖 Starting Humbu Platform..."
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
echo "⏳ Waiting for platform to initialize..."
sleep 8

echo ""
echo "3. 🧪 Testing local platform..."
LOCAL_TEST=$(curl -s http://localhost:8102/health | grep -o "status" | head -1)
if [ "$LOCAL_TEST" = "status" ]; then
    echo "✅ Local platform is working!"
else
    echo "❌ Local platform failed to start"
    echo "💡 Check the platform manually in proot session"
    exit 1
fi

echo ""
echo "4. 🌐 Starting Cloudflare Tunnel..."
echo "📢 This will create a NEW public URL..."
cd ~
cloudflared tunnel --url http://localhost:8102
