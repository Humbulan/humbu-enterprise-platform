#!/bin/bash
echo "🏰 HUMBU MICROSERVICES PLATFORM - DOCKER-LESS DEPLOYMENT"
echo "========================================================"

# Stop any running services
pkill -f "node.*server.js" 2>/dev/null
pkill -f "node.*index-microservices" 2>/dev/null
sleep 3

echo "🚀 Starting Microservices..."

# Start User Service
cd microservices/user-service
nohup node server.js > ../../logs/user-service.log 2>&1 &
USER_PID=$!
echo "👥 User Service started (PID: $USER_PID) on port 8201"

# Start Auth Service
cd ../auth-service
nohup node server.js > ../../logs/auth-service.log 2>&1 &
AUTH_PID=$!
echo "🔐 Auth Service started (PID: $AUTH_PID) on port 8202"

# Start Payment Service
cd ../payment-service
nohup node server.js > ../../logs/payment-service.log 2>&1 &
PAYMENT_PID=$!
echo "💳 Payment Service started (PID: $PAYMENT_PID) on port 8203"

# Start API Gateway
cd ../../docker-deployment/api-gateway
nohup node index-microservices.js > ../../logs/api-gateway.log 2>&1 &
GATEWAY_PID=$!
echo "🌐 API Gateway started (PID: $GATEWAY_PID) on ports 8102/8143"

# Save PIDs for management
cd ../..
echo "$USER_PID" > .pids/user-service.pid
echo "$AUTH_PID" > .pids/auth-service.pid
echo "$PAYMENT_PID" > .pids/payment-service.pid
echo "$GATEWAY_PID" > .pids/api-gateway.pid

echo ""
echo "⏳ Waiting for services to initialize..."
sleep 8

echo ""
echo "🧪 Testing Microservices Deployment..."

# Test API Gateway
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8102/health || echo "FAILED")
HTTPS_STATUS=$(curl -s -k -o /dev/null -w "%{http_code}" https://localhost:8143/health || echo "FAILED")

echo "📊 API Gateway Status:"
echo "  HTTP: $HTTP_STATUS, HTTPS: $HTTPS_STATUS"

if [ "$HTTP_STATUS" = "200" ]; then
    echo ""
    echo "🎉 MICROSERVICES DEPLOYMENT SUCCESSFUL!"
    echo ""
    echo "🌐 PRODUCTION ACCESS:"
    echo "   HTTP Gateway:  http://localhost:8102/health"
    echo "   HTTPS Gateway: https://localhost:8143/health"
    echo ""
    echo "🔧 AVAILABLE ENDPOINTS:"
    echo "   Users:      curl http://localhost:8102/api/users"
    echo "   Auth:       curl -X POST http://localhost:8102/api/auth/login -d '{\"username\":\"admin\",\"password\":\"password\"}'"
    echo "   Payments:   curl -X POST http://localhost:8102/api/payments/process -d '{\"amount\":99.99,\"currency\":\"USD\"}'"
    echo "   Services:   curl http://localhost:8102/api/services/status"
    echo ""
    echo "📋 SERVICE MANAGEMENT:"
    echo "   View logs:    tail -f logs/api-gateway.log"
    echo "   Stop all:     ./stop-microservices.sh"
    echo "   Status:       ./status-microservices.sh"
    echo ""
    echo "🏁 ENTERPRISE MICROSERVICES READY!"
else
    echo ""
    echo "❌ Deployment issues detected"
    echo "📋 Checking service logs..."
    tail -10 logs/api-gateway.log
fi
