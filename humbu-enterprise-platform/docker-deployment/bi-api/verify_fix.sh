#!/bin/bash

URL="https://fastapi-mobile-app.onrender.com"
echo "🎯 VERIFYING APP FIX"
echo "===================="

for i in {1..8}; do
    echo "🔄 Check $i/8 - $(date '+%H:%M:%S')"
    
    response=$(curl -s --max-time 15 "$URL/" || echo "CURL_ERROR")
    
    if echo "$response" | grep -q "BUSINESS API V7.0.0"; then
        echo ""
        echo "🎉 🎉 🎉 SUCCESS! BUSINESS API IS LIVE! 🎉 🎉 🎉"
        echo ""
        
        # Test all endpoints
        endpoints=("/health" "/dashboard" "/customers")
        for endpoint in "${endpoints[@]}"; do
            echo -n "🔍 $endpoint: "
            if curl -s --max-time 10 "$URL$endpoint" > /dev/null; then
                echo "✅ WORKING"
            else
                echo "❌ FAILED"
            fi
        done
        
        echo ""
        echo "🌐 YOUR BUSINESS API IS READY:"
        echo "$URL"
        break
    elif echo "$response" | grep -q "CURL_ERROR"; then
        echo "⏳ Service starting..."
    else
        echo "🔍 Response: ${response:0:100}..."
    fi
    
    sleep 30
done
