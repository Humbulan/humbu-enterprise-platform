#!/bin/bash

echo "🐳 HUMBU PLATFORM - PODMAN DEPLOYMENT (ROOTLESS)"
echo "================================================"

# Check if Podman is available
if ! command -v podman &> /dev/null; then
    echo "❌ Podman not found. Installing..."
    pkg update && pkg install -y podman
fi

if ! command -v podman &> /dev/null; then
    echo "❌ Podman installation failed. Trying alternative approach..."
    exit 1
fi

echo "✅ Podman is available: $(podman --version)"

# Install podman-compose if needed
if ! command -v podman-compose &> /dev/null; then
    echo "📦 Installing podman-compose..."
    pip install podman-compose 2>/dev/null || pkg install -y python-pip && pip install podman-compose
fi

echo "🚀 Starting services with Podman..."
podman-compose up -d

echo "⏳ Waiting for services to start..."
sleep 10

echo "🔍 Checking container status..."
podman ps

echo "🧪 Testing services..."
curl -s http://localhost:8102/health || echo "❌ Services not ready yet"

echo ""
echo "🎯 PODMAN DEPLOYMENT COMPLETE!"
echo "Access: http://localhost:8102"
