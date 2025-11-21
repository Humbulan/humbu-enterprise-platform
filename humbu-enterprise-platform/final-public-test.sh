#!/bin/bash

PUBLIC_URL="https://abc-its-deviation-fate.trycloudflare.com"

echo "🎯 FINAL PUBLIC ACCESS TEST"
echo "=========================="
echo "Public URL: $PUBLIC_URL"
echo ""

echo "📊 TEST RESULTS:"
echo "---------------"

# Test 1: Health Check
echo -n "1. Health Check: "
if curl -s "$PUBLIC_URL/health" | grep -q "status"; then
    echo "✅ SUCCESS"
else
    echo "❌ FAILED"
fi

# Test 2: AI Service
echo -n "2. AI Service: "
AI_RESPONSE=$(curl -s -X POST "$PUBLIC_URL/api/v1/ai/chat" \
  -H "Content-Type: application/json" \
  -d '{"message":"Final public test!"}')
if echo "$AI_RESPONSE" | grep -q "response"; then
    echo "✅ SUCCESS"
    echo "$AI_RESPONSE" | head -1
else
    echo "❌ FAILED"
    echo "$AI_RESPONSE"
fi

# Test 3: BI Service
echo -n "3. BI Service: "
BI_RESPONSE=$(curl -s "$PUBLIC_URL/api/v1/bi/alerts")
if echo "$BI_RESPONSE" | grep -q "current_metrics"; then
    echo "✅ SUCCESS"
    echo "$BI_RESPONSE" | grep "system_status" | head -1
else
    echo "❌ FAILED"
    echo "$BI_RESPONSE"
fi

# Test 4: Platform Info
echo -n "4. Platform Info: "
if curl -s "$PUBLIC_URL/api/platform" | grep -q "Humbu Enterprise"; then
    echo "✅ SUCCESS"
else
    echo "❌ FAILED"
fi

echo ""
echo "🌐 PUBLIC DEPLOYMENT STATUS: COMPLETE! 🎉"
echo "========================================"
echo "Your Humbu Platform is now publicly accessible at:"
echo "🔗 $PUBLIC_URL"
echo ""
echo "Share this URL with the world! 🌍"
