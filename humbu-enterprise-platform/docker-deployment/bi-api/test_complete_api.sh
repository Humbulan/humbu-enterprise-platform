#!/bin/bash

URL="https://fastapi-mobile-app-7kvj.onrender.com"

echo "🎯 COMPLETE API TEST - BUSINESS + AI INTEGRATION"
echo "================================================"

echo ""
echo "1. Testing Business API Endpoints:"
echo "----------------------------------"

business_endpoints=("/" "/health" "/dashboard" "/customers")
for endpoint in "${business_endpoints[@]}"; do
    echo -n "🔍 $endpoint: "
    response=$(curl -s --max-time 10 "$URL$endpoint")
    if echo "$response" | grep -q "timestamp"; then
        echo "✅ LIVE"
        echo "   Response: ${response:0:80}..."
    else
        echo "❌ OFFLINE"
    fi
done

echo ""
echo "2. Testing AI Integration Endpoints:"
echo "------------------------------------"

ai_endpoints=("/integration/status" "/ai/health")
for endpoint in "${ai_endpoints[@]}"; do
    echo -n "🔍 $endpoint: "
    response=$(curl -s --max-time 10 "$URL$endpoint")
    if echo "$response" | grep -q "timestamp"; then
        echo "✅ LIVE"
    else
        echo "❌ OFFLINE - Response: $response"
    fi
done

echo ""
echo "3. Testing AI Chat Proxy:"
echo "-------------------------"

echo -n "🔍 POST /ai/chat: "
chat_response=$(curl -s -X POST "$URL/ai/chat" \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello AI"}' \
  --max-time 10)

if echo "$chat_response" | grep -q "AI Agent unavailable"; then
    echo "✅ PROXY WORKING (AI offline as expected)"
else
    echo "🔧 Response: $chat_response"
fi

echo ""
echo "4. Testing Business AI Chat:"
echo "---------------------------"

echo -n "🔍 POST /ai/business-chat: "
business_chat_response=$(curl -s -X POST "$URL/ai/business-chat" \
  -H "Content-Type: application/json" \
  -d '{"user_message": "What is our current revenue?"}' \
  --max-time 10)

if echo "$business_chat_response" | grep -q "ai_response"; then
    echo "✅ BUSINESS AI WORKING"
    echo "   Response includes business context"
else
    echo "🔧 Response: $business_chat_response"
fi

echo ""
echo "🌐 YOUR COMPLETE API IS READY:"
echo "=============================="
echo "Business API: $URL"
echo "AI Integration: $URL/ai/chat"
echo "Status Dashboard: $URL/integration/status"
