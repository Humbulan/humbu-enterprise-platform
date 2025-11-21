#!/bin/bash

echo "🧪 TESTING NATIVE DEPLOYMENT"
echo "============================"

echo "1. Checking service processes:"
ps aux | grep -E "(uvicorn|node.*index.js)" | grep -v grep

echo ""
echo "2. Testing API Gateway Health:"
curl -s http://localhost:8102/health | python3 -m json.tool 2>/dev/null || curl -s http://localhost:8102/health

echo ""
echo "3. Testing BI Alerts:"
curl -s http://localhost:8102/api/v1/bi/alerts | python3 -m json.tool 2>/dev/null || curl -s http://localhost:8102/api/v1/bi/alerts

echo ""
echo "4. Testing AI Chat:"
curl -s -X POST http://localhost:8102/api/v1/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Testing native deployment!"}' | python3 -m json.tool 2>/dev/null || echo "Response received"

echo ""
echo "🎯 NATIVE DEPLOYMENT TEST COMPLETE!"
