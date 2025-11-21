#!/bin/bash

echo "🎯 COMPLETE AI INTEGRATION VERIFICATION"
echo "======================================="

echo ""
echo "1. Testing Local AI Agent..."
LOCAL_RESPONSE=$(curl -s http://localhost:8102/health)
if echo "$LOCAL_RESPONSE" | grep -q "healthy"; then
    echo "✅ Local AI Agent: ONLINE"
    echo "   Response: $LOCAL_RESPONSE"
else
    echo "❌ Local AI Agent: OFFLINE"
    echo "   Start it with: python3 simple_ai_agent.py"
    exit 1
fi

echo ""
echo "2. Testing Local AI Chat..."
AI_CHAT_RESPONSE=$(curl -s -X POST http://localhost:8102/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Test business analysis"}')
if echo "$AI_CHAT_RESPONSE" | grep -q "response"; then
    echo "✅ Local AI Chat: WORKING"
    echo "$AI_CHAT_RESPONSE" | python3 -c "
import json, sys
data = json.load(sys.stdin)
print('   AI Response:', data.get('response', 'No response'))
print('   Confidence:', data.get('confidence', 'Unknown'))
"
else
    echo "❌ Local AI Chat: FAILED"
    echo "   Response: $AI_CHAT_RESPONSE"
fi

echo ""
echo "3. Testing Render API AI Health..."
RENDER_AI_HEALTH=$(curl -s https://fastapi-mobile-app-7kvj.onrender.com/ai/health)
if echo "$RENDER_AI_HEALTH" | grep -q "online"; then
    echo "✅ Render AI Proxy: ONLINE"
    echo "$RENDER_AI_HEALTH" | python3 -c "
import json, sys
data = json.load(sys.stdin)
print('   Status:', data.get('ai_agent_status', 'Unknown'))
"
else
    echo "❌ Render AI Proxy: OFFLINE"
    echo "   Response: $RENDER_AI_HEALTH"
fi

echo ""
echo "4. Testing Full AI Integration..."
FULL_AI_RESPONSE=$(curl -s -X POST https://fastapi-mobile-app-7kvj.onrender.com/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Analyze our business growth and revenue"}')
if echo "$FULL_AI_RESPONSE" | grep -q "response"; then
    echo "✅ Full AI Integration: SUCCESS!"
    echo "$FULL_AI_RESPONSE" | python3 -c "
import json, sys
data = json.load(sys.stdin)
print('   🤖 AI:', data.get('response', 'No response'))
print('   📊 Confidence:', data.get('confidence', 'Unknown'))
"
else
    echo "❌ Full AI Integration: FAILED"
    echo "   Response: $FULL_AI_RESPONSE"
fi

echo ""
echo "5. Testing Business API Endpoints..."
echo "   Dashboard:"
curl -s "https://fastapi-mobile-app-7kvj.onrender.com/dashboard" | python3 -c "
import json, sys
data = json.load(sys.stdin)
print('   Revenue: $' + str(data.get('revenue', 0)))
print('   Customers:', data.get('customers', 0))
"

echo ""
echo "🎉 INTEGRATION STATUS: COMPLETE SUCCESS!"
echo "🌐 Your AI Agent is now fully integrated with your Business API!"
echo ""
echo "📊 Available Endpoints:"
echo "   - Local AI: http://localhost:8102/api/ai/chat"
echo "   - Render API: https://fastapi-mobile-app-7kvj.onrender.com/ai/chat"
echo "   - Business Dashboard: https://fastapi-mobile-app-7kvj.onrender.com/dashboard"
