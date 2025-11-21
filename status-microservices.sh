#!/bin/bash
echo "📊 HUMBU MICROSERVICES STATUS"
echo "============================="

echo "🔍 Process Status:"
ps aux | grep -e "node.*server.js" -e "node.*index-microservices" | grep -v grep

echo ""
echo "🌐 API Gateway Health:"
curl -s http://localhost:8102/health 2>/dev/null | head -10 || echo "❌ API Gateway not responding"

echo ""
echo "🔧 Individual Services:"
echo "  User Service (8201): $(curl -s http://localhost:8201/health >/dev/null && echo '✅' || echo '❌')"
echo "  Auth Service (8202): $(curl -s http://localhost:8202/health >/dev/null && echo '✅' || echo '❌')"
echo "  Payment Service (8203): $(curl -s http://localhost:8203/health >/dev/null && echo '✅' || echo '❌')"

echo ""
echo "📈 Service Logs (last 5 lines):"
for service in api-gateway user-service auth-service payment-service; do
    if [ -f "logs/$service.log" ]; then
        echo "  $service: $(tail -1 logs/$service.log | cut -c1-50)..."
    fi
done
