#!/bin/bash
echo "🔄 HUMBU PLATFORM LIVE MONITORING"
while true; do
  clear
  echo "$(date) - Platform Status:"
  curl -s http://localhost:8102/health | grep -o '"status":"[^"]*"'
  echo "Services:"
  curl -s http://localhost:8102/api/services/status | grep -o '"status":"healthy"' | wc -l | xargs echo "Healthy:"
  sleep 5
done
