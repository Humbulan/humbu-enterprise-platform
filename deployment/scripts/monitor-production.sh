#!/bin/bash
echo "📊 HUMBU PLATFORM - PRODUCTION MONITORING"
echo "========================================"
echo "Monitoring started at: $(date)"
echo ""

# Health checks
echo "🏥 HEALTH CHECKS:"
HTTP_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8102/health || echo "FAILED")
HTTPS_HEALTH=$(curl -s -k -o /dev/null -w "%{http_code}" https://localhost:8143/health || echo "FAILED")

echo "  HTTP:  $HTTP_HEALTH"
echo "  HTTPS: $HTTPS_HEALTH"

# SSL certificate check
echo ""
echo "🔐 SSL CERTIFICATES:"
if [ -f "humbu-enterprise-platform/docker-deployment/ssl/cert.pem" ]; then
    CERT_INFO=$(openssl x509 -in humbu-enterprise-platform/docker-deployment/ssl/cert.pem -noout -subject -dates 2>/dev/null | head -3)
    if [ $? -eq 0 ]; then
        echo "  ✅ Certificates valid"
        echo "$CERT_INFO" | sed 's/^/  /'
    else
        echo "  ❌ Certificate error"
    fi
else
    echo "  ❌ Certificates not found"
fi

# Service status
echo ""
echo "🔄 SERVICE STATUS:"
PROCESSES=$(pgrep -f "node.*js" | wc -l)
echo "  Node processes: $PROCESSES"

# Memory usage
echo ""
echo "💾 MEMORY USAGE:"
if command -v pmap >/dev/null 2>&1; then
    PIDS=$(pgrep -f "node.*js")
    for pid in $PIDS; do
        MEMORY=$(pmap $pid | tail -1 | awk '{print $2}')
        echo "  PID $pid: $MEMORY"
    done
else
    echo "  Memory info: pmap not available"
fi

# Recent logs
echo ""
echo "📝 RECENT LOGS:"
tail -5 /data/data/com.termux/files/home/platform-https.log 2>/dev/null | sed 's/^/  /'

# Deployment info
echo ""
echo "🚀 DEPLOYMENT INFO:"
LATEST_DEPLOYMENT=$(find deployment/backup -name "deployment-info.json" -exec dirname {} \; | xargs -I {} basename {} | sort -r | head -1)
if [ -n "$LATEST_DEPLOYMENT" ]; then
    echo "  Latest: $LATEST_DEPLOYMENT"
    cat deployment/backup/$LATEST_DEPLOYMENT/deployment-info.json 2>/dev/null | grep -E '"deployment_id|"status"' | sed 's/^/  /'
else
    echo "  No deployment records found"
fi

echo ""
echo "⏰ Monitoring completed at: $(date)"
