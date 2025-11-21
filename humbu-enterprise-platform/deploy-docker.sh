#!/bin/bash

echo "🐳 DEPLOYING HUMBU PLATFORM WITH DOCKER COMPOSE"
echo "=============================================="

# Check Docker
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    echo "💡 Try: dockerd &"
    exit 1
fi

echo "✅ Docker is running"

# Build and start services
echo "🛠️ Building Docker images..."
docker-compose build

echo "🚀 Starting services..."
docker-compose up -d

echo "⏳ Waiting for services to start..."
sleep 20

echo ""
echo "🎉 DOCKER DEPLOYMENT COMPLETE!"
echo "=============================================="
echo "🐳 CONTAINERS RUNNING:"
docker-compose ps

echo ""
echo "🌐 ACCESS ENDPOINTS:"
echo "   📡 API Gateway:   http://localhost:8102"
echo "   🤖 AI Service:    http://ai-agent:8000 (internal)"
echo "   📊 BI Service:    http://bi-api:8001 (internal)"

echo ""
echo "🧪 TEST COMMANDS:"
echo "   Gateway Health: curl http://localhost:8102/health"
echo "   Platform Info:  curl http://localhost:8102/api/platform"
echo "   AI Chat:        curl -X POST http://localhost:8102/api/v1/ai/chat"
echo "   BI Alerts:      curl http://localhost:8102/api/v1/bi/alerts"

echo ""
echo "🔧 MANAGEMENT:"
echo "   View logs:    docker-compose logs -f"
echo "   Stop:         docker-compose down"
echo "   Restart:      docker-compose restart"
echo "=============================================="
