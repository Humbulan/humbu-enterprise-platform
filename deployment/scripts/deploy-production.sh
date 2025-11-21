#!/bin/bash
set -e

echo "🚀 HUMBU ULTIMATE PLATFORM - PRODUCTION DEPLOYMENT"
echo "=================================================="

DEPLOY_TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="deployment/backup/$DEPLOY_TIMESTAMP"

echo "📦 Deployment started at: $(date)"
echo "📁 Backup directory: $BACKUP_DIR"

# Create backup
echo "💾 Creating backup..."
mkdir -p $BACKUP_DIR
cp -r humbu-enterprise-platform/docker-deployment/api-gateway $BACKUP_DIR/ || true
cp -r humbu-enterprise-platform/docker-deployment/ssl $BACKUP_DIR/ || true

echo "✅ Backup created: $BACKUP_DIR"

# Stop existing services
echo "🛑 Stopping existing services..."
pkill -f "node.*js" || true
sleep 3

# Deploy new version
echo "📤 Deploying new version..."

# Start HTTPS platform
echo "🔒 Starting HTTPS platform..."
cd humbu-enterprise-platform/docker-deployment/api-gateway
nohup node index-https.js > /data/data/com.termux/files/home/platform-https.log 2>&1 &

# Wait for startup
echo "⏳ Waiting for services to start..."
sleep 5

# Health check
echo "🏥 Performing health checks..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8102/health || echo "000")
HTTPS_STATUS=$(curl -s -k -o /dev/null -w "%{http_code}" https://localhost:8143/health || echo "000")

echo "📊 Health Check Results:"
echo "   HTTP:  $HTTP_STATUS"
echo "   HTTPS: $HTTPS_STATUS"

if [ "$HTTP_STATUS" = "200" ] && [ "$HTTPS_STATUS" = "200" ]; then
    echo "🎉 DEPLOYMENT SUCCESSFUL!"
    echo "📋 Deployment Summary:"
    echo "   Timestamp: $DEPLOY_TIMESTAMP"
    echo "   Version: Ultimate Platform HTTPS"
    echo "   HTTP Port: 8102"
    echo "   HTTPS Port: 8143"
    echo "   SSL: Enabled"
    echo "   Status: All systems operational"
    
    # Create deployment record
    cat > $BACKUP_DIR/deployment-info.json << DEPLOYINFO
{
  "deployment_id": "$DEPLOY_TIMESTAMP",
  "version": "ultimate-https-1.0.0",
  "timestamp": "$(date -Iseconds)",
  "status": "success",
  "services": {
    "http_gateway": "running",
    "https_gateway": "running",
    "ssl": "enabled"
  },
  "health_checks": {
    "http": "$HTTP_STATUS",
    "https": "$HTTPS_STATUS"
  },
  "backup_location": "$BACKUP_DIR"
}
DEPLOYINFO

else
    echo "❌ DEPLOYMENT FAILED!"
    echo "🔍 Checking logs..."
    tail -10 /data/data/com.termux/files/home/platform-https.log
    
    # Rollback
    echo "🔄 Attempting rollback..."
    cp -r $BACKUP_DIR/api-gateway/* humbu-enterprise-platform/docker-deployment/api-gateway/ || true
    
    echo "🚨 Please check logs and deploy manually"
    exit 1
fi

echo ""
echo "🌐 PRODUCTION ACCESS:"
echo "   HTTP:  curl http://localhost:8102/health"
echo "   HTTPS: curl -k https://localhost:8143/health"
echo ""
echo "🔐 SSL INFO:"
echo "   curl -k https://localhost:8143/ssl/info"
echo ""
echo "🏁 DEPLOYMENT COMPLETED: $(date)"
