#!/bin/bash

echo "🚀 Deploying Humbu Enterprise Platform..."

# Build and push Docker images
docker-compose build

# Deploy to Kubernetes
kubectl apply -f infrastructure/kubernetes/

echo "✅ Deployment complete!"
echo "🌐 Access services at:"
echo "   Web Frontend: http://localhost"
echo "   API Gateway: http://localhost:8080"
echo "   AI Agent: http://localhost:8001"
