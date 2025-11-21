#!/bin/bash

echo "🚀 Testing Humbu Unified Enterprise Platform"
echo "============================================"

# Kill any existing services
pkill -f "uvicorn" 2>/dev/null || true
pkill -f "node index.js" 2>/dev/null || true

# Clear ports
lsof -ti:8080 | xargs kill -9 2>/dev/null || true
lsof -ti:8001 | xargs kill -9 2>/dev/null || true

echo ""
echo "1. Starting AI Agent..."
cd services/ai-agent
python -m uvicorn main:app --host 0.0.0.0 --port 8001 &
AI_PID=$!
sleep 3

echo "2. Testing AI Agent directly..."
curl -s -X POST http://localhost:8001/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Direct AI test"}'
echo ""

echo "3. Starting API Gateway..."
cd ../api-gateway
node index.js &
GATEWAY_PID=$!
sleep 3

echo "4. Testing Gateway Health..."
curl -s http://localhost:8102/health
echo ""

echo "5. Testing AI through Gateway..."
curl -s -X POST http://localhost:8102/api/v1/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Gateway integration test"}'
echo ""

echo "6. Testing Platform Info..."
curl -s http://localhost:8102/api/platform
echo ""

echo ""
echo "============================================"
echo "🎉 Platform Test Complete!"
echo ""
echo "Services Running:"
echo "   AI Agent: http://localhost:8001"
echo "   API Gateway: http://localhost:8102"
echo ""
echo "To stop services: pkill -f 'uvicorn|node index.js'"

# Keep services running
echo ""
echo "Services will continue running. Press Ctrl+C to stop all services."
echo ""

# Wait for user input to stop
read -p "Press Enter to stop all services..."
pkill -f "uvicorn"
pkill -f "node index.js"
echo "Services stopped."
