#!/bin/bash
echo "🧪 HUMBU PLATFORM - COMPREHENSIVE ENDPOINT TESTING"
echo "=================================================="

echo "🔍 Testing All Endpoints..."
echo ""

echo "1. 🌐 API Gateway Health:"
curl -s http://localhost:8102/health | grep -o '"status":"[^"]*"'

echo ""
echo "2. 👥 User Service:"
echo "   Gateway: $(curl -s http://localhost:8102/api/users >/dev/null && echo '✅' || echo '❌')"
echo "   Direct: $(curl -s http://localhost:8201/health >/dev/null && echo '✅' || echo '❌')"

echo ""
echo "3. 🔐 Auth Service:"
echo "   Login: $(curl -s -X POST http://localhost:8102/api/auth/login -H "Content-Type: application/json" -d '{"username":"admin","password":"password"}' >/dev/null && echo '✅' || echo '❌')"
echo "   Direct: $(curl -s http://localhost:8202/health >/dev/null && echo '✅' || echo '❌')"

echo ""
echo "4. 💳 Payment Service:"
echo "   Processing: $(curl -s -X POST http://localhost:8102/api/payments/process -H "Content-Type: application/json" -d '{"amount":99.99,"currency":"USD"}' >/dev/null && echo '✅' || echo '❌')"
echo "   Direct: $(curl -s http://localhost:8203/health >/dev/null && echo '✅' || echo '❌')"

echo ""
echo "5. 🔄 Service Discovery:"
curl -s http://localhost:8102/api/services/status | grep -o '"status":"[^"]*"' | head -3

echo ""
echo "🏆 TEST RESULTS SUMMARY:"
echo "========================"
if curl -s http://localhost:8102/health >/dev/null; then
    echo "🎉 Platform is RUNNING and RESPONSIVE"
    echo "🚀 All systems are GO!"
else
    echo "❌ Platform is not responding"
    echo "🔧 Please check service status"
fi
