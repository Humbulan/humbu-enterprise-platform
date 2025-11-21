#!/bin/bash

echo "🚀 Starting Humbu Enterprise Platform..."
echo "==========================================="

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! docker info &> /dev/null; then
    echo "❌ Docker is not running. Please start Docker daemon."
    exit 1
fi

echo "✅ Docker is ready"

# Build and start services
echo "🛠️  Building services..."
docker-compose build

echo "🚀 Starting all services..."
docker-compose up -d

echo "⏳ Waiting for services to start..."
sleep 10

echo "==========================================="
echo "🎉 Humbu Enterprise Platform is running!"
echo ""
echo "🌐 Access Points:"
echo "   Web Frontend:    http://localhost"
echo "   API Gateway:     http://localhost:8102"
echo "   AI Service:      http://localhost:8001"
echo "   Utility API:     http://localhost:3000"
echo "   Database:        localhost:5432"
echo ""
echo "📊 Check platform status:"
echo "   curl http://localhost:8102/health"
echo ""
echo "🛑 To stop: docker-compose down"
echo "==========================================="
