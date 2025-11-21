#!/bin/bash
echo "🐳 HUMBU PLATFORM - DOCKER COMPOSE DEPLOYMENT"
echo "============================================"

# Stop existing services
docker-compose down 2>/dev/null

# Build and start services
echo "🚀 Building and starting microservices..."
docker-compose up --build -d

echo "⏳ Waiting for services to start..."
sleep 10

# Test deployment
echo "🧪 Testing microservices deployment..."

# Test API Gateway
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8102/health || echo "FAILED")
HTTPS_STATUS=$(curl -s -k -o /dev/null -w "%{http_code}" https://localhost:8143/health || echo "FAILED")

# Test microservices through gateway
SERVICES_STATUS=$(curl -s http://localhost:8102/api/services/status | grep -o '"status":"[^"]*"' | wc -l)

echo ""
echo "📊 DEPLOYMENT RESULTS:"
echo "  API Gateway HTTP:  $HTTP_STATUS"
echo "  API Gateway HTTPS: $HTTPS_STATUS"
echo "  Services Available: $SERVICES_STATUS"

if [ "$HTTP_STATUS" = "200" ] && [ "$HTTPS_STATUS" = "200" ]; then
    echo ""
    echo "🎉 DOCKER COMPOSE DEPLOYMENT SUCCESSFUL!"
    echo ""
    echo "🌐 PRODUCTION ACCESS:"
    echo "   HTTP Gateway:  http://localhost:8102/health"
    echo "   HTTPS Gateway: https://localhost:8143/health"
    echo ""
    echo "🔧 AVAILABLE ENDPOINTS:"
    echo "   Users:      http://localhost:8102/api/users"
    echo "   Auth:       http://localhost:8102/api/auth/login"
    echo "   Payments:   http://localhost:8102/api/payments/process"
    echo "   Services:   http://localhost:8102/api/services/status"
    echo ""
    echo "🐳 DOCKER COMPOSE COMMANDS:"
    echo "   View logs:    docker-compose logs -f"
    echo "   Stop:         docker-compose down"
    echo "   Restart:      docker-compose restart"
    echo "   Status:       docker-compose ps"
    echo ""
    echo "🏁 ENTERPRISE MICROSERVICES READY!"
else
    echo ""
    echo "❌ Deployment issues detected"
    echo "📋 Checking service logs..."
    docker-compose logs --tail=20
fi
