#!/bin/bash
echo "🏆 HUMBU ENTERPRISE PLATFORM - PRODUCTION DEPLOYMENT"
echo "==================================================="

echo "🔧 Deployment Options:"
echo "1. No-SSL Microservices (Fast & Simple)"
echo "2. SSL Microservices (Secure)"
echo "3. Direct Services Only (No Gateway)"
read -p "Choose deployment type (1-3): " choice

case $choice in
    1)
        echo "🚀 Deploying No-SSL Microservices..."
        ./start-microservices-nossl.sh
        ;;
    2)
        echo "🔒 Deploying SSL Microservices..."
        # First fix SSL certificates
        mkdir -p docker-deployment/ssl
        if [ ! -f "docker-deployment/ssl/key.pem" ]; then
            echo "📝 Generating SSL certificates..."
            openssl req -new -newkey rsa:4096 -days 365 -nodes -x509 \
                -subj "/C=US/ST=State/L=City/O=Humbu/CN=platform.humbu.store" \
                -keyout docker-deployment/ssl/key.pem \
                -out docker-deployment/ssl/cert.pem 2>/dev/null
        fi
        ./start-microservices.sh
        ;;
    3)
        echo "🎯 Starting Direct Services Only..."
        ./stop-microservices.sh
        sleep 2
        
        # Start services directly
        cd microservices/user-service && nohup node server.js > ../../logs/user-service.log 2>&1 &
        cd ../auth-service && nohup node server.js > ../../logs/auth-service.log 2>&1 &
        cd ../payment-service && nohup node server.js > ../../logs/payment-service.log 2>&1 &
        
        echo ""
        echo "✅ Direct Services Started:"
        echo "   User Service: http://localhost:8201/health"
        echo "   Auth Service: http://localhost:8202/health"
        echo "   Payment Service: http://localhost:8203/health"
        ;;
    *)
        echo "❌ Invalid choice. Using No-SSL deployment."
        ./start-microservices-nossl.sh
        ;;
esac

echo ""
echo "🏁 DEPLOYMENT COMPLETE!"
echo "======================"
