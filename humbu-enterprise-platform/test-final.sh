#!/bin/bash

echo "🧪 COMPREHENSIVE PLATFORM TEST"
echo "=============================="

BASE_URL="http://localhost:8102"

echo "1. 📊 Platform Information:"
curl -s "$BASE_URL/api/platform" | head -20

echo ""
echo "2. ❤️ Health Check:"
curl -s "$BASE_URL/health" | head -10

echo ""
echo "3. 📈 BI Alerts Test:"
curl -s "$BASE_URL/api/v1/bi/alerts" | head -15

echo ""
echo "4. 🤖 AI Chat Test:"
curl -s -X POST "$BASE_URL/api/v1/ai/chat" \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello from the final deployment!"}' | head -15

echo ""
echo "5. 🔍 Direct Service Access:"
echo "   AI Agent: $(curl -s -o /dev/null -w '%{http_code}' http://localhost:8100/health)"
echo "   BI API:   $(curl -s -o /dev/null -w '%{http_code}' http://localhost:8101/api/alerts)"

echo ""
echo "🎯 TESTING COMPLETE!"
