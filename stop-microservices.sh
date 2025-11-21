#!/bin/bash
echo "🛑 STOPPING HUMBU MICROSERVICES"
echo "================================"

# Stop using PIDs if available
if [ -d ".pids" ]; then
    for pid_file in .pids/*.pid; do
        if [ -f "$pid_file" ]; then
            pid=$(cat "$pid_file")
            kill $pid 2>/dev/null && echo "✅ Stopped service (PID: $pid)" || echo "❌ Could not stop service (PID: $pid)"
        fi
    done
fi

# Force kill any remaining node processes
pkill -f "node.*server.js" 2>/dev/null
pkill -f "node.*index-microservices" 2>/dev/null

echo "✅ All microservices stopped"
