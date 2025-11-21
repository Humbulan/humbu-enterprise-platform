#!/bin/bash

echo "🎯 FINAL Humbu Platform Test"
echo "============================"

# Nuclear option for cleanup
echo "1. Cleaning up..."
pkill -f "uvicorn" 2>/dev/null || true
pkill -f "node" 2>/dev/null || true
pkill -f "python" 2>/dev/null || true
sudo fuser -k 8080/tcp 2>/dev/null || true
sudo fuser -k 8001/tcp 2>/dev/null || true
sleep 2

echo "2. Starting AI Agent..."
cd services/ai-agent
python -m uvicorn main:app --host 0.0.0.0 --port 8001 &
AI_PID=$!
sleep 4  # Give it more time to start

echo "3. Testing AI Agent directly..."
AI_RESPONSE=$(curl -s -X POST http://localhost:8001/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Direct connection test"}')
echo "AI Response: $AI_RESPONSE"

echo "4. Starting API Gateway..."
cd ../api-gateway
node index.js &
GATEWAY_PID=$!
sleep 3

echo "5. Testing Gateway..."
GATEWAY_HEALTH=$(curl -s http://localhost:8102/health)
echo "Gateway Health: $GATEWAY_HEALTH"

echo "6. Testing AI through Gateway..."
GATEWAY_AI_RESPONSE=$(curl -s -X POST http://localhost:8102/api/v1/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Gateway routing test"}')
echo "Gateway AI Response: $GATEWAY_AI_RESPONSE"

echo "7. Testing Platform Info..."
PLATFORM_INFO=$(curl -s http://localhost:8102/api/platform)
echo "Platform Info: $PLATFORM_INFO"

echo ""
echo "========================================="
echo "🎉 TEST RESULTS:"
if [[ ! -z "$AI_RESPONSE" ]]; then
    echo "✅ AI Agent: WORKING"
else
    echo "❌ AI Agent: FAILED"
fi

if [[ ! -z "$GATEWAY_HEALTH" ]]; then
    echo "✅ API Gateway: WORKING" 
else
    echo "❌ API Gateway: FAILED"
fi

if [[ "$GATEWAY_AI_RESPONSE" == *"routed_through"* ]]; then
    echo "✅ Gateway Routing: WORKING"
else
    echo "❌ Gateway Routing: FAILED"
fi

echo ""
echo "🌐 Access Points:"
echo "   AI Direct:    http://localhost:8001"
echo "   API Gateway:  http://localhost:8102"
echo ""
echo "Press Ctrl+C to stop services"
echo ""

# Keep running until user stops
while true; do
    sleep 10
done
