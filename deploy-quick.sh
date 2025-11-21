#!/bin/bash
echo "🚀 HUMBU PLATFORM - QUICK PRODUCTION DEPLOYMENT"
echo "=============================================="

# Stop existing
pkill -f "node.*js" 2>/dev/null
sleep 2

# Start HTTPS platform
cd humbu-enterprise-platform/docker-deployment/api-gateway
nohup node index-https-simple.js > /data/data/com.termux/files/home/platform-production.log 2>&1 &

echo "⏳ Starting services..."
sleep 5

# Test deployment
echo "🧪 Testing deployment..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8102/health || echo "FAILED")
HTTPS_STATUS=$(curl -s -k -o /dev/null -w "%{http_code}" https://localhost:8143/health || echo "FAILED")

echo ""
echo "📊 DEPLOYMENT RESULTS:"
echo "  HTTP:  $HTTP_STATUS"
echo "  HTTPS: $HTTPS_STATUS"

if [ "$HTTP_STATUS" = "200" ] && [ "$HTTPS_STATUS" = "200" ]; then
    echo ""
    echo "🎉 DEPLOYMENT SUCCESSFUL!"
    echo ""
    echo "🌐 PRODUCTION ACCESS:"
    echo "   HTTP:  http://localhost:8102/health"
    echo "   HTTPS: https://localhost:8143/health"
    echo ""
    echo "🔐 SSL SECURITY:"
    echo "   curl -k https://localhost:8143/ssl/info"
    echo ""
    echo "🏁 PRODUCTION READY!"
else
    echo ""
    echo "❌ Deployment issues detected"
    echo "📋 Checking logs..."
    tail -10 /data/data/com.termux/files/home/platform-production.log
fi
