#!/bin/bash

RENDER_URL="https://fastapi-mobile-app-7kvj.onrender.com"

echo "🤖 TESTING AI INTEGRATION ENDPOINTS"
echo "==================================="

echo ""
echo "1. Testing integration status:"
curl -s "$RENDER_URL/integration/status" | python3 -m json.tool

echo ""
echo "2. Testing AI health (will show offline since AI runs locally):"
curl -s "$RENDER_URL/ai/health" | python3 -m json.tool

echo ""
echo "3. Testing business chat endpoint:"
curl -s -X POST "$RENDER_URL/ai/business-chat" \
  -H "Content-Type: application/json" \
  -d '{"user_message": "What is our current revenue and customer count?"}' \
  | python3 -m json.tool

echo ""
echo "4. Testing regular AI chat:"
curl -s -X POST "$RENDER_URL/ai/chat" \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello AI, how are you?"}' \
  | python3 -m json.tool

echo ""
echo "🎯 TEST COMPLETE!"
echo "💡 Note: AI endpoints will work when your AI Agent is running on localhost:8102"
