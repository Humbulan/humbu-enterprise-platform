#!/bin/bash

echo "🐳 HUMBU ENTERPRISE PLATFORM - DOCKER STATUS"
echo "============================================"

echo ""
echo "🔧 CONTAINER STATUS:"
docker compose ps

echo ""
echo "📊 RESOURCE USAGE:"
docker stats --no-stream $(docker compose ps -q) 2>/dev/null || echo "  (Run 'docker stats' separately for resource info)"

echo ""
echo "🌐 ACCESS ENDPOINTS:"
echo "   🤖 AI Agent Direct:  http://localhost:8001"
echo "   📡 API Gateway:      http://localhost:8102"
echo "   🌐 Web Frontend:     http://localhost"
echo "   🗄️  Database:        localhost:5432"

echo ""
echo "🚀 QUICK ACTIONS:"
echo "   Start:    ./manage-platform.sh start"
echo "   Stop:     ./manage-platform.sh stop"
echo "   Restart:  ./manage-platform.sh restart"
echo "   Logs:     ./manage-platform.sh logs"
echo "   Deploy:   ./deploy-platform.sh"

echo ""
echo "🎯 DOCKER DEPLOYMENT: READY ✅"
