#!/bin/bash

echo "🔧 NATIVE PLATFORM MANAGEMENT"
echo "============================="

case "$1" in
    "start")
        ./deploy-native.sh
        ;;
    "stop")
        echo "🛑 Stopping all services..."
        pkill -f "uvicorn.*8000"
        pkill -f "node.*index.js" 
        pkill -f "http.server.*80"
        rm -f .ai_pid .gateway_pid .web_pid .env
        echo "✅ All services stopped"
        ;;
    "restart")
        echo "🔄 Restarting services..."
        pkill -f "uvicorn.*8000"
        pkill -f "node.*index.js"
        pkill -f "http.server.*80"
        sleep 3
        ./deploy-native.sh
        ;;
    "status")
        echo "📊 SERVICE STATUS:"
        echo "🌍 Environment: $(grep NODE_ENV .env 2>/dev/null | cut -d= -f2 || echo 'unknown')"
        echo ""
        
        if pgrep -f "uvicorn.*8000" > /dev/null; then
            echo "🤖 AI Agent:      ✅ RUNNING (port 8000)"
            curl -s http://localhost:8000/health | grep -o '"status":"[^"]*"' || echo "   ❌ Not responding"
        else
            echo "🤖 AI Agent:      ❌ STOPPED"
        fi
        
        if pgrep -f "node.*index.js" > /dev/null; then
            echo "📡 API Gateway:   ✅ RUNNING (port 8080)"
            curl -s http://localhost:8102/health | grep -o '"status":"[^"]*"' || echo "   ❌ Not responding"
        else
            echo "📡 API Gateway:   ❌ STOPPED"
        fi
        
        if pgrep -f "http.server.*80" > /dev/null; then
            echo "🌐 Web Frontend:  ✅ RUNNING (port 80)"
        else
            echo "🌐 Web Frontend:  ❌ STOPPED"
        fi
        
        echo ""
        echo "🔗 CONNECTIVITY TEST:"
        if curl -s http://localhost:8102/api/v1/ai/health > /dev/null; then
            echo "   Gateway → AI:  ✅ CONNECTED"
        else
            echo "   Gateway → AI:  ❌ DISCONNECTED"
        fi
        
        echo ""
        echo "🌐 TEST ENDPOINTS:"
        echo "   AI Direct:    curl http://localhost:8000/health"
        echo "   API Gateway:  curl http://localhost:8102/health"
        echo "   AI Health:    curl http://localhost:8102/api/v1/ai/health"
        echo "   AI Chat:      curl -X POST http://localhost:8102/api/v1/ai/chat"
        ;;
    "logs")
        echo "📋 SERVICE INFORMATION:"
        echo "AI Agent URL: http://localhost:8000"
        echo "Gateway URL:  http://localhost:8102"
        echo "Environment:  $(grep NODE_ENV .env 2>/dev/null | cut -d= -f2 || echo 'unknown')"
        echo ""
        echo "Recent activity will appear in terminal outputs"
        ;;
    "env")
        echo "🌍 ENVIRONMENT CONFIGURATION:"
        cat .env 2>/dev/null || echo "No environment file found"
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status|logs|env}"
        echo ""
        echo "Services:"
        echo "  AI Agent: http://localhost:8000"
        echo "  API Gateway: http://localhost:8102"
        echo "  Web Frontend: http://localhost:80"
        exit 1
        ;;
esac
