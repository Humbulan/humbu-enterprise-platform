#!/bin/bash

echo "🎯 ULTIMATE HUMBU PLATFORM DEPLOYMENT"
echo "====================================="

# Function to check port usage
check_port() {
    local port=$1
    if netstat -tulpn 2>/dev/null | grep ":$port " > /dev/null; then
        echo "❌ Port $port is in use"
        return 1
    else
        echo "✅ Port $port is free"
        return 0
    fi
}

# Function to start Docker
start_docker() {
    echo "🐳 Starting Docker daemon..."
    dockerd &
    local DOCKER_PID=$!
    sleep 10
    
    if docker info > /dev/null 2>&1; then
        echo "✅ Docker started successfully (PID: $DOCKER_PID)"
        return 0
    else
        echo "❌ Docker failed to start"
        return 1
    fi
}

# Main deployment
echo "1. Checking system..."
check_port 8001
check_port 8080 
check_port 80
check_port 5432

echo ""
echo "2. Starting Docker..."
if start_docker; then
    echo ""
    echo "3. Deploying platform..."
    
    # Try Docker Compose first
    if docker compose version &>/dev/null; then
        echo "🔄 Using docker compose..."
        docker compose up --build -d
    elif command -v docker-compose &>/dev/null; then
        echo "🔄 Using docker-compose..."
        docker-compose up --build -d
    else
        echo "🔄 Using manual deployment..."
        ./deploy-manual.sh
    fi
    
    echo ""
    echo "4. Waiting for services..."
    sleep 15
    
    echo ""
    echo "5. Testing deployment..."
    echo "📡 API Gateway:"
    curl -s http://localhost:8102/health || echo "❌ Not responding yet"
    
    echo ""
    echo "🤖 AI Service:"
    curl -s -X POST http://localhost:8102/api/v1/ai/chat \
      -H "Content-Type: application/json" \
      -d '{"message":"Deployment test"}' | grep -o '"response":"[^"]*"' || echo "❌ Not ready yet"
    
    echo ""
    echo "🐳 Container status:"
    docker ps
    
else
    echo "❌ Cannot proceed without Docker"
    echo "Please manually start Docker with: dockerd &"
    echo "Then run: ./deploy-platform.sh"
fi

echo ""
echo "====================================="
echo "🎯 DEPLOYMENT ATTEMPT COMPLETE"
