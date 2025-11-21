#!/bin/bash

echo "🏢 COMPLETE HUMBU ENTERPRISE PLATFORM MANAGEMENT"
echo "================================================"

case "$1" in
    "start")
        echo "🚀 Starting Complete Platform..."
        # Start Humbu Platform
        cd ~/humbu-enterprise-platform/humbu-enterprise-platform
        ./deploy-native.sh
        
        # Start BI API
        echo ""
        echo "📊 Starting Business Intelligence API..."
        cd ~/fastapi-clean
        source venv/bin/activate
        uvicorn main_with_ai_and_alerts:app --host 0.0.0.0 --port 8001 &
        echo $! > ../humbu-enterprise-platform/humbu-enterprise-platform/.bi_pid
        sleep 5
        
        echo "🎉 Complete Platform Started!"
        ;;
    "stop")
        echo "🛑 Stopping All Services..."
        # Stop Humbu Platform
        cd ~/humbu-enterprise-platform/humbu-enterprise-platform
        ./manage-native.sh stop
        
        # Stop BI API
        pkill -f "uvicorn.*8001"
        rm -f .bi_pid
        
        echo "✅ All Services Stopped"
        ;;
    "status")
        echo "📊 COMPLETE PLATFORM STATUS:"
        echo "============================"
        
        # Humbu Platform Status
        cd ~/humbu-enterprise-platform/humbu-enterprise-platform
        ./manage-native.sh status
        
        echo ""
        echo "📈 BUSINESS INTELLIGENCE:"
        if pgrep -f "uvicorn.*8001" > /dev/null; then
            echo "   📊 BI API:        ✅ RUNNING (port 8001)"
            curl -s http://localhost:8001/api/alerts | grep -o '"system_status":"[^"]*"' || echo "   ❌ Not responding"
        else
            echo "   📊 BI API:        ❌ STOPPED"
        fi
        
        echo ""
        echo "🌐 ACCESS ENDPOINTS:"
        echo "   🤖 Humbu AI:      http://localhost:8000"
        echo "   📡 API Gateway:    http://localhost:8102"
        echo "   📊 BI Dashboard:   http://localhost:8001/api/alerts"
        echo "   💬 AI Chat:        curl -X POST http://localhost:8102/api/v1/ai/chat"
        ;;
    "test")
        echo "🧪 COMPREHENSIVE PLATFORM TEST"
        echo "=============================="
        
        echo "1. Testing Humbu AI Gateway:"
        curl -s http://localhost:8102/health | python3 -m json.tool
        
        echo ""
        echo "2. Testing Business Intelligence:"
        curl -s http://localhost:8001/api/alerts | python3 -m json.tool
        
        echo ""
        echo "3. Testing Integrated AI Chat:"
        curl -s -X POST http://localhost:8102/api/v1/ai/chat \
          -H "Content-Type: application/json" \
          -d '{"message":"Test complete platform integration!"}' | python3 -m json.tool
        ;;
    *)
        echo "Usage: $0 {start|stop|status|test}"
        echo ""
        echo "Manages Complete Humbu Enterprise Platform:"
        echo "  🤖 Humbu AI Services + 📊 Business Intelligence"
        echo ""
        echo "Services:"
        echo "  AI Agent: http://localhost:8000"
        echo "  API Gateway: http://localhost:8102"
        echo "  BI API: http://localhost:8001"
        exit 1
        ;;
esac
