#!/bin/bash

echo "Setting up development environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Start all services
docker-compose up -d

echo "✅ Development environment ready!"
echo "Services running:"
echo "   - AI Agent: http://localhost:8001"
echo "   - Utility API: http://localhost:3000"
echo "   - Web Frontend: http://localhost"
echo "   - API Gateway: http://localhost:8102"
