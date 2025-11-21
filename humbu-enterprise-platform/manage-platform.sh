#!/bin/bash

case "$1" in
    "start")
        docker compose up -d
        echo "🚀 Platform starting..."
        ;;
    "stop")
        docker compose down
        echo "🛑 Platform stopped"
        ;;
    "restart")
        docker compose restart
        echo "🔄 Platform restarting..."
        ;;
    "logs")
        docker compose logs -f
        ;;
    "status")
        docker compose ps
        ;;
    "build")
        docker compose build --no-cache
        echo "🏗️  Services rebuilt"
        ;;
    "update")
        docker compose pull
        docker compose up -d
        echo "📦 Platform updated"
        ;;
    *)
        echo "Humbu Platform Management"
        echo "Usage: $0 {start|stop|restart|logs|status|build|update}"
        echo ""
        echo "Services:"
        echo "  AI Agent: http://localhost:8001"
        echo "  API Gateway: http://localhost:8102"
        echo "  Web Frontend: http://localhost"
        exit 1
        ;;
esac
