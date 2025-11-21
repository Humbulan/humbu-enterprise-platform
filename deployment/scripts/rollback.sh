#!/bin/bash
echo "🔄 HUMBU PLATFORM - ROLLBACK UTILITY"
echo "==================================="

if [ -z "$1" ]; then
    echo "📁 Available backups:"
    find deployment/backup -name "deployment-info.json" -exec dirname {} \; | xargs -I {} basename {} | sort -r
    echo ""
    echo "Usage: $0 <backup_timestamp>"
    echo "Example: $0 20241119_214500"
    exit 1
fi

BACKUP_TIMESTAMP=$1
BACKUP_DIR="deployment/backup/$BACKUP_TIMESTAMP"

if [ ! -d "$BACKUP_DIR" ]; then
    echo "❌ Backup not found: $BACKUP_DIR"
    exit 1
fi

echo "🔄 Starting rollback to: $BACKUP_TIMESTAMP"

# Stop services
echo "🛑 Stopping services..."
pkill -f "node.*js" || true
sleep 3

# Restore backup
echo "📥 Restoring from backup..."
cp -r $BACKUP_DIR/api-gateway/* humbu-enterprise-platform/docker-deployment/api-gateway/ || true

# Start services
echo "🚀 Starting rolled back version..."
cd humbu-enterprise-platform/docker-deployment/api-gateway

# Check which version to start
if [ -f "index-https.js" ]; then
    nohup node index-https.js > /data/data/com.termux/files/home/platform-rollback.log 2>&1 &
else
    nohup node index-ultimate-fixed.js > /data/data/com.termux/files/home/platform-rollback.log 2>&1 &
fi

sleep 5

# Verify rollback
echo "🏥 Verifying rollback..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8102/health || echo "000")

if [ "$HTTP_STATUS" = "200" ]; then
    echo "✅ ROLLBACK SUCCESSFUL!"
    echo "📋 Rollback Summary:"
    echo "   From: $BACKUP_TIMESTAMP"
    echo "   Status: System restored"
    echo "   Health: $HTTP_STATUS"
else
    echo "❌ Rollback verification failed"
    tail -10 /data/data/com.termux/files/home/platform-rollback.log
fi
