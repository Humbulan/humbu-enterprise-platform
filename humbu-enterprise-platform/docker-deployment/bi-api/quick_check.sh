#!/bin/bash

URL="https://fastapi-mobile-app-7kvj.onrender.com"

echo "🔍 QUICK DEPLOYMENT STATUS"
echo "=========================="

for i in {1..5}; do
    echo "Check $i/5:"
    response=$(curl -s --max-time 10 "$URL/integration/status")
    if echo "$response" | grep -q "v8.0.0"; then
        echo "✅ V8.0.0 DEPLOYED WITH AI INTEGRATION!"
        curl -s "$URL/integration/status" | python3 -m json.tool
        break
    else
        echo "⏳ Still deploying v8.0.0..."
        sleep 30
    fi
done
