#!/bin/bash

echo "📊 Humbu Platform Status"
echo "========================"

# Check Docker containers
echo "🐳 Container Status:"
docker-compose ps

echo ""
echo "🔗 Service Health:"

# Check API Gateway
if curl -s http://localhost:8080/health > /dev/null; then
    echo "✅ API Gateway: HEALTHY"
else
    echo "❌ API Gateway: UNHEALTHY"
fi

# Check AI Service
if curl -s http://localhost:8001/health > /dev/null 2>&1; then
    echo "✅ AI Service: HEALTHY"
else
    echo "❌ AI Service: UNHEALTHY"
fi

# Check Utility API
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Utility API: HEALTHY"
else
    echo "❌ Utility API: UNHEALTHY"
fi

echo ""
echo "🌐 Platform Info:"
curl -s http://localhost:8080/api/platform | grep -E '"name"|"status"'
