#!/bin/bash

RENDER_URL="https://fastapi-mobile-app.onrender.com"
echo "🎯 RENDER DEPLOYMENT VERIFICATION"
echo "================================"
echo "⚠️  NOT testing locally - only checking Render deployment"
echo "🌐 Target: $RENDER_URL"
echo ""

for i in {1..12}; do
    echo "🔄 Check #$i - $(date '+%H:%M:%S')"
    
    # Test ONLY the Render URL
    response=$(curl -s --max-time 20 "$RENDER_URL/" || echo "CURL_ERROR")
    
    if echo "$response" | grep -q "BUSINESS API V7.0.0"; then
        echo ""
        echo "🎉 🎉 🎉 RENDER DEPLOYMENT SUCCESS! 🎉 🎉 🎉"
        echo "✅ BUSINESS API IS LIVE ON RENDER!"
        
        # Test Render endpoints
        echo ""
        echo "📊 TESTING RENDER ENDPOINTS:"
        endpoints=("/health" "/dashboard" "/customers")
        for endpoint in "${endpoints[@]}"; do
            echo -n "🔍 $endpoint: "
            if curl -s --max-time 10 "$RENDER_URL$endpoint" > /dev/null; then
                echo "✅ WORKING"
            else
                echo "❌ FAILED"
            fi
        done
        
        echo ""
        echo "🚀 BUSINESS API V7.0.0 DEPLOYED SUCCESSFULLY TO RENDER!"
        break
        
    elif echo "$response" | grep -q "<!DOCTYPE html>"; then
        echo "❌ OLD WEB APP STILL RUNNING ON RENDER"
        echo "💡 Render is still deploying or cache needs clearing"
    elif echo "$response" | grep -q "CURL_ERROR"; then
        echo "⏳ RENDER SERVICE STARTING..."
    else
        echo "🔍 RENDER RESPONSE: ${response:0:100}..."
    fi
    
    sleep 30
done

echo ""
echo "📋 RENDER FINAL STATUS:"
curl -s --max-time 10 "$RENDER_URL/health" | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    print('✅ SERVICE: ' + data.get('service', 'Unknown'))
    print('📦 VERSION: ' + data.get('version', 'Unknown'))
    print('🟢 STATUS: ' + data.get('status', 'Unknown'))
except:
    print('❌ RENDER SERVICE NOT RESPONDING')
    print('💡 Check Render dashboard for deployment status')
"
