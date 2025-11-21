#!/bin/bash

echo "🚀 Deploying Humbu Enterprise Platform with Docker Compose"
echo "=========================================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if docker compose is available
if ! docker compose version > /dev/null 2>&1; then
    echo "❌ docker compose is not available. Please install Docker Compose."
    exit 1
fi

echo "✅ Docker is running"
echo "✅ docker compose is available"

# Build and start services
echo "🛠️  Building and starting services..."
docker compose up --build -d

echo "⏳ Waiting for services to start..."
sleep 15

echo ""
echo "🎉 DEPLOYMENT COMPLETE!"
echo "=========================================================="
echo "🌐 SERVICES NOW RUNNING:"
echo "   🤖 AI Agent:      http://localhost:8001"
echo "   📡 API Gateway:   http://localhost:8102" 
echo "   🌐 Web Frontend:  http://localhost"
echo "   🗄️  Database:      localhost:5432"
echo ""
echo "🔧 MANAGEMENT COMMANDS:"
echo "   View logs:        docker compose logs -f"
echo "   Stop services:    docker compose down"
echo "   Restart:          docker compose restart"
echo "   Status:           docker compose ps"
echo ""
echo "🧪 TEST DEPLOYMENT:"
echo "   Health Check:     curl http://localhost:8102/health"
echo "   AI via Gateway:   curl -X POST http://localhost:8102/api/v1/ai/chat \\"
echo "                     -H 'Content-Type: application/json' \\"
echo "                     -d '{\"message\":\"Docker test\"}'"
echo "=========================================================="
