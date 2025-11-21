#!/bin/bash
echo "🛑 Stopping Humbu Platform services..."
pkill -F .ai-agent.pid 2>/dev/null || true
pkill -F .bi-api.pid 2>/dev/null || true  
pkill -F .api-gateway.pid 2>/dev/null || true
rm -f .*.pid
echo "✅ All services stopped"
