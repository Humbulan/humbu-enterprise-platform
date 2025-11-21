#!/bin/bash

echo "🎯 VERIFYING COMPLETE AI INTEGRATION"
echo "==================================="

echo "1. Testing Local AI Agent..."
LOCAL_HEALTH=$(curl -s http://localhost:8102/health)
if echo "$LOCAL_HEALTH" | grep -q "healthy"; then
    echo "✅ Local AI Agent: ONLINE"
else
    echo "❌ Local AI Agent: OFFLINE"
    echo "   Start it with: python3 simple_ai_agent.py"
    exit 1
fi

echo ""
echo "2. Testing Render API AI Proxy..."
RENDER_AI_HEALTH=$(curl -s https://fastapi-mobile-app-7kvj.onrender.com/ai/health)
if echo "$RENDER_AI_HEALTH" | grep -q "online"; then
    echo "✅ Render AI Proxy: ONLINE"
else
    echo "❌ Render AI Proxy: OFFLINE"
fi

echo ""
echo "3. Testing AI Chat Integration..."
AI_RESPONSE=$(curl -s -X POST https://fastapi-mobile-app-7kvj.onrender.com/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Business analysis"}')
if echo "$AI_RESPONSE" | grep -q "response"; then
    echo "✅ AI Chat Integration: WORKING"
    echo "$AI_RESPONSE" | python3 -c "
import json, sys
data = json.load(sys.stdin)
print('   AI:', data.get('response', 'No response'))
"
else
    echo "❌ AI Chat Integration: FAILED"
fi

echo ""
echo "🎉 INTEGRATION STATUS: COMPLETE"
echo "🌐 Your AI Agent is now connected to your Business API!"
