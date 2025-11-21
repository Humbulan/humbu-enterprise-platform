#!/bin/bash

echo "📊 HUMBU PLATFORM - LIVE DASHBOARD"
echo "=================================="
echo "Last update: $(date)"
echo ""

while true; do
    clear
    echo "📊 HUMBU PLATFORM - LIVE DASHBOARD"
    echo "=================================="
    echo "Last update: $(date)"
    echo ""
    
    # Service status
    echo "🌐 SERVICE STATUS:"
    echo "-----------------"
    services=(
        "AI Agent:8100/health"
        "BI API:8101/api/alerts" 
        "Gateway:8102/health"
    )
    
    for service in "${services[@]}"; do
        name=$(echo $service | cut -d: -f1)
        port_path=$(echo $service | cut -d: -f2)
        status=$(curl -s -o /dev/null -w '%{http_code}' "http://localhost:${port_path}" 2>/dev/null || echo "DOWN")
        
        if [ "$status" = "200" ]; then
            echo "  ✅ $name: RUNNING"
        else
            echo "  ❌ $name: STOPPED"
        fi
    done
    
    echo ""
    echo "🔧 PROCESSES:"
    echo "-------------"
    ps aux | grep -E "(uvicorn|node.*index-fixed)" | grep -v grep | while read line; do
        pid=$(echo $line | awk '{print $2}')
        cmd=$(echo $line | awk '{for(i=11;i<=NF;i++) printf $i " "; print ""}')
        echo "  📝 $cmd"
    done
    
    echo ""
    echo "💡 Quick Access:"
    echo "  Platform:  curl http://localhost:8102"
    echo "  AI Chat:   curl -X POST http://localhost:8102/api/v1/ai/chat -d '{\"message\":\"test\"}'"
    echo "  BI Alerts: curl http://localhost:8102/api/v1/bi/alerts"
    echo ""
    echo "⏹️  Press Ctrl+C to exit"
    sleep 5
done
