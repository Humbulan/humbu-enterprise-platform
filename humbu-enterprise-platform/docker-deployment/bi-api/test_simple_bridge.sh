#!/bin/bash

echo "🎯 TESTING SIMPLE AI BRIDGE"
echo "==========================="

echo ""
echo "1. Bridge Status:"
curl -s "http://localhost:8001/" | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    print('✅', data.get('message', 'Unknown'))
    print('🟢 Status:', data.get('status', 'Unknown'))
except:
    print('❌ Bridge not running')
"

echo ""
echo "2. Business Dashboard:"
curl -s "http://localhost:8001/business/dashboard" | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    print('💰 Revenue: $' + str(data.get('revenue', 0)))
    print('👥 Customers:', data.get('customers', 0))
    print('📊 Source:', data.get('source', 'direct'))
except:
    print('❌ Business data failed')
"

echo ""
echo "3. AI Chat:"
curl -s -X POST "http://localhost:8001/ai/chat" \
  -H "Content-Type: application/json" \
  -d '{"message": "How is our business performing?"}' | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    print('🤖 AI:', data.get('response', 'No response'))
    print('🎯 Confidence:', data.get('confidence', 'Unknown'))
    print('🔗 Source:', data.get('source', 'Unknown'))
except:
    print('❌ AI chat failed')
"

echo ""
echo "4. System Status:"
curl -s "http://localhost:8001/status" | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    print('🌐 Business API:', data.get('business_api', 'Unknown'))
    print('🤖 Local AI:', data.get('local_ai', 'Unknown'))
    print('🔗 Bridge:', data.get('bridge', 'Unknown'))
    print('📱 Mobile Ready:', data.get('mobile_ready', 'Unknown'))
except:
    print('❌ Status check failed')
"

echo ""
echo "🎉 SIMPLE BRIDGE READY!"
echo "📱 Mobile apps can connect to: http://localhost:8001"
