#!/bin/bash

echo "🚀 HUMBU PLATFORM - FINAL NATIVE DEPLOYMENT"
echo "==========================================="

# Kill any existing services
echo "🛑 Stopping existing services..."
pkill -f "uvicorn" 2>/dev/null || true
pkill -f "node.*index-fixed" 2>/dev/null || true
sleep 2

# Port configuration
AI_PORT=8100
BI_PORT=8101
GATEWAY_PORT=8102

echo "📡 Using ports: AI=$AI_PORT, BI=$BI_PORT, Gateway=$GATEWAY_PORT"

# Start AI Agent
echo "🤖 Starting AI Agent Service..."
cd docker-deployment/ai-agent
python -m uvicorn main:app --host 0.0.0.0 --port $AI_PORT &
AI_PID=$!
cd ../..
echo $AI_PID > .ai-agent.pid

# Start BI API
echo "📊 Starting BI API Service..."
cd docker-deployment/bi-api
python -m uvicorn main_with_ai_and_alerts:app --host 0.0.0.0 --port $BI_PORT &
BI_PID=$!
cd ../..
echo $BI_PID > .bi-api.pid

echo "⏳ Waiting for Python services to start..."
sleep 5

# Start Gateway with the corrected file
echo "🌐 Starting API Gateway..."
cd docker-deployment/api-gateway
node index-fixed.js &
GATEWAY_PID=$!
cd ../..
echo $GATEWAY_PID > .api-gateway.pid

echo "⏳ Waiting for gateway to start..."
sleep 5

# Test all services
echo ""
echo "🧪 SERVICE HEALTH CHECK:"
echo "========================"

check_service() {
    local name=$1
    local url=$2
    local status=$(curl -s -o /dev/null -w '%{http_code}' "$url" 2>/dev/null || echo "FAIL")
    
    if [ "$status" = "200" ]; then
        echo "✅ $name: HEALTHY (HTTP $status)"
    else
        echo "❌ $name: UNHEALTHY (HTTP $status)"
    fi
}

check_service "AI Agent" "http://localhost:8100/health"
check_service "BI API" "http://localhost:8101/api/alerts"
check_service "API Gateway" "http://localhost:8102/health"

echo ""
echo "🎉 DEPLOYMENT COMPLETE!"
echo "======================"
echo "🌐 Access your platform: http://localhost:8102"
echo ""
echo "📊 Quick Test:"
echo "  curl http://localhost:8102/api/platform"
echo ""
echo "🛑 Stop services: ./stop-native.sh"
