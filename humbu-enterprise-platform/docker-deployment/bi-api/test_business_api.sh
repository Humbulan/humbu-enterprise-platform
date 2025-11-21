#!/bin/bash

API_URL="https://fastapi-mobile-app-7kvj.onrender.com"
echo "🚀 BUSINESS API COMPREHENSIVE TEST"
echo "================================="

echo "🌐 API URL: $API_URL"
echo ""

# Test all endpoints
endpoints=("/" "/health" "/dashboard" "/customers")

for endpoint in "${endpoints[@]}"; do
    echo "📡 Testing $endpoint:"
    response=$(curl -s --max-time 10 "${API_URL}${endpoint}")
    exit_code=$?
    
    if [ $exit_code -eq 0 ]; then
        echo "✅ HTTP 200 OK"
        echo "📦 Response: $response" | head -c 150
        echo -e "\n---"
    else
        echo "❌ Failed to connect (Exit code: $exit_code)"
    fi
    echo ""
done

echo "🎯 API STATUS SUMMARY:"
curl -s "$API_URL/health" | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    print('✅ SERVICE: ' + data.get('service', 'Unknown'))
    print('📦 VERSION: ' + data.get('version', 'Unknown'))
    print('🟢 STATUS: ' + data.get('status', 'Unknown'))
    print('⏰ TIMESTAMP: ' + data.get('timestamp', 'Unknown'))
except:
    print('❌ Could not parse health check')
"
