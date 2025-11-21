#!/bin/bash

echo "🚀 Manual Docker Deployment for Humbu Platform"
echo "=============================================="

# Check Docker
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker not running"
    exit 1
fi

echo "✅ Docker is running"

# Build AI Agent
echo "🛠️ Building AI Agent..."
docker build -t humbu-ai-agent ./services/ai-agent

# Build API Gateway  
echo "🛠️ Building API Gateway..."
docker build -t humbu-api-gateway ./services/api-gateway

# Build Web Frontend
echo "🛠️ Building Web Frontend..."
docker build -t humbu-web-frontend ./apps/web-frontend

# Start services manually
echo "🚀 Starting services..."

# Start AI Agent
docker run -d --name ai_agent -p 8001:8000 humbu-ai-agent

# Start API Gateway
docker run -d --name api_gateway -p 8080:8080 \
  --link ai_agent:ai-agent humbu-api-gateway

# Start Web Frontend  
docker run -d --name web_frontend -p 80:80 humbu-web-frontend

echo "⏳ Waiting for services..."
sleep 10

echo ""
echo "🎉 MANUAL DEPLOYMENT COMPLETE!"
echo "Services:"
docker ps
