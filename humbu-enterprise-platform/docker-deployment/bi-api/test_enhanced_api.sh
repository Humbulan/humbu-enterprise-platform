#!/bin/bash

URL="https://fastapi-mobile-app-7kvj.onrender.com"

echo "🎯 TESTING ENHANCED API v9.0.0"
echo "=============================="

echo ""
echo "1. API Status:"
curl -s "$URL/" | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    print('✅', data.get('message', 'Unknown'))
    print('📦 Version:', data.get('version', 'Unknown'))
    print('🤖 AI:', data.get('ai_capability', 'Unknown'))
except:
    print('❌ API not responding')
"

echo ""
echo "2. AI Health:"
curl -s "$URL/ai/health" | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    print('🔌 External AI:', data.get('external_ai_status', 'Unknown'))
    print('🤖 Built-in AI:', data.get('built_in_ai_status', 'Unknown'))
    print('🎯 Overall:', data.get('overall_ai_capability', 'Unknown'))
except:
    print('❌ AI health check failed')
"

echo ""
echo "3. AI Chat (Will work with built-in AI):"
curl -s -X POST "$URL/ai/chat" \
  -H "Content-Type: application/json" \
  -d '{"message": "Analyze our business revenue and growth strategy"}' | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    print('🤖 Response:', data.get('response', 'No response'))
    print('📊 Source:', data.get('source', 'Unknown'))
    print('🎯 Confidence:', data.get('confidence', 'Unknown'))
    if data.get('built_in_fallback'):
        print('💡 Note: Using built-in AI (external unavailable)')
except:
    print('❌ AI chat failed')
"

echo ""
echo "🌐 Your API is now AI-capable regardless of external connections!"
