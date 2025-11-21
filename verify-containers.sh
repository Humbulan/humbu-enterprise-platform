#!/bin/bash
echo "🔍 VERIFYING CONTAINERIZED HUMBU PLATFORM"
echo "=========================================="

services=("8201" "8202" "8203" "8204")
service_names=("User" "Auth" "Payment" "Notification")

for i in "${!services[@]}"; do
  port=${services[$i]}
  name=${service_names[$i]}
  if curl -s http://localhost:$port > /dev/null; then
    echo "✅ $name Service (port $port): HEALTHY"
  else
    echo "❌ $name Service (port $port): UNHEALTHY"
  fi
done

echo ""
echo "🐳 Docker Containers:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep humbu
