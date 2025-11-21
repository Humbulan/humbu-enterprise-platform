#!/bin/bash

echo "🧪 TESTING DOCKER DEPLOYMENT"
echo "============================"

echo "1. Testing API Gateway Health:"
curl -s http://localhost:8102/health | python3 -m json.tool

echo ""
echo "2. Testing BI Alerts through Gateway:"
curl -s http://localhost:8102/api/v1/bi/alerts | python3 -m json.tool

echo ""
echo "3. Testing AI Chat through Gateway:"
curl -s -X POST http://localhost:8102/api/v1/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Testing Docker deployment!"}' | python3 -m json.tool

echo ""
echo "4. Container Status:"
docker-compose ps

echo ""
echo "🎯 DOCKER DEPLOYMENT TEST COMPLETE!"
