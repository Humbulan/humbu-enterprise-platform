#!/bin/bash

echo "📱 Termux Humbu Platform Management"
echo "==================================="

case "$1" in
    "start")
        echo "Starting Docker daemon..."
        dockerd &
        sleep 5
        echo "Starting platform services..."
        docker compose up -d
        echo "🚀 Platform starting..."
        ;;
    "stop")
        echo "Stopping platform services..."
        docker compose down
        echo "Stopping Docker daemon..."
        pkill -f "dockerd"
        echo "🛑 Platform stopped"
        ;;
    "restart")
        echo "Restarting platform..."
        docker compose restart
        echo "🔄 Platform restarting..."
        ;;
    "logs")
        docker compose logs -f
        ;;
    "status")
        echo "Docker Daemon:"
        pgrep -x "dockerd" > /dev/null && echo "✅ Running" || echo "❌ Stopped"
        echo ""
        echo "Container Status:"
        docker compose ps
        ;;
    "deploy")
        echo "🛠️ Building and deploying..."
        docker compose build
        docker compose up -d
        echo "🎉 Deployment complete!"
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|logs|status|deploy}"
        echo ""
        echo "Services:"
        echo "  AI Agent: http://localhost:8001"
        echo "  API Gateway: http://localhost:8102"
        echo "  Web Frontend: http://localhost"
        echo "  Database: localhost:5432"
        echo ""
        echo "Note: In Termux, Docker must be started first"
        exit 1
        ;;
esac
