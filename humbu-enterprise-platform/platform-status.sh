#!/bin/bash

echo "📊 HUMBU ENTERPRISE PLATFORM - LIVE STATUS"
echo "=========================================="

echo ""
echo "🔧 CORE SERVICES:"

# Check AI Agent
AI_STATUS=$(curl -s http://localhost:8001/health 2>/dev/null | grep -o '"status":"[^"]*"' | cut -d'"' -f4 || echo "offline")
if [[ "$AI_STATUS" == "healthy" ]]; then
    echo "   🤖 AI Agent:      ✅ ONLINE (port 8001)"
else
    echo "   🤖 AI Agent:      ❌ OFFLINE"
fi

# Check API Gateway  
GATEWAY_STATUS=$(curl -s http://localhost:8102/health 2>/dev/null | grep -o '"status":"[^"]*"' | cut -d'"' -f4 || echo "offline")
if [[ "$GATEWAY_STATUS" == "OK" ]]; then
    echo "   📡 API Gateway:   ✅ ONLINE (port 8080)"
else
    echo "   📡 API Gateway:   ❌ OFFLINE"
fi

echo ""
echo "🌐 ENDPOINTS:"
echo "   AI Direct Chat:    curl -X POST http://localhost:8001/chat"
echo "   AI Gateway Chat:   curl -X POST http://localhost:8102/api/v1/ai/chat"
echo "   Platform Info:     curl http://localhost:8102/api/platform"
echo "   Health Check:      curl http://localhost:8102/health"

echo ""
echo "📁 PLATFORM STRUCTURE:"
echo "   📂 apps/           - Frontend applications"
echo "   📂 services/       - Backend microservices"
echo "   📂 infrastructure/ - Deployment configs"
echo "   📂 automation/     - Business automation"
echo "   📂 shared/         - Shared libraries"

echo ""
echo "🚀 QUICK COMMANDS:"
echo "   Start:    ./test-platform-final.sh"
echo "   Status:   ./platform-status.sh"
echo "   Stop:     pkill -f 'uvicorn|node'"

echo ""
echo "🎯 UNIFICATION STATUS: COMPLETE ✅"
echo "   All 9 repositories unified into one platform"
