#!/bin/bash
echo "🔍 HUMBU PLATFORM - QUICK STATUS CHECK"
echo "======================================"

echo "📊 Service Status:"
echo "=================="

# Check API Gateway
if curl -s http://localhost:8102/health >/dev/null; then
    echo "🌐 API Gateway: ✅ RUNNING"
else
    echo "🌐 API Gateway: ❌ STOPPED"
fi

# Check individual services
if curl -s http://localhost:8201/health >/dev/null; then
    echo "👥 User Service: ✅ RUNNING"
else
    echo "👥 User Service: ❌ STOPPED"
fi

if curl -s http://localhost:8202/health >/dev/null; then
    echo "🔐 Auth Service: ✅ RUNNING"
else
    echo "🔐 Auth Service: ❌ STOPPED"
fi

if curl -s http://localhost:8203/health >/dev/null; then
    echo "💳 Payment Service: ✅ RUNNING"
else
    echo "💳 Payment Service: ❌ STOPPED"
fi

echo ""
echo "🚀 Quick Commands:"
echo "=================="
echo "Start:    ./start-microservices-nossl.sh"
echo "Stop:     ./stop-microservices.sh"
echo "Status:   ./status-microservices.sh"
echo "Test:     ./test-all-endpoints.sh"
echo "Verify:   ./verify-platform.sh"
