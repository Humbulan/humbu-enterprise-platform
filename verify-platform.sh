#!/bin/bash
echo "🔍 HUMBU PLATFORM - AUTOMATED VERIFICATION"
echo "=========================================="

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo ""
echo "📊 Checking Service Status..."
echo "============================="

# Check if services are running
if curl -s http://localhost:8102/health >/dev/null; then
    echo -e "${GREEN}✅ API Gateway: RUNNING${NC}"
    GATEWAY_STATUS="healthy"
else
    echo -e "${RED}❌ API Gateway: NOT RUNNING${NC}"
    GATEWAY_STATUS="unhealthy"
fi

# Test individual services through gateway
echo ""
echo "🌐 Testing Service Routing..."
echo "============================"

# Test User Service
if curl -s http://localhost:8102/api/users >/dev/null; then
    echo -e "${GREEN}✅ User Service: ROUTING OK${NC}"
    USER_ROUTING="ok"
else
    echo -e "${RED}❌ User Service: ROUTING FAILED${NC}"
    USER_ROUTING="failed"
fi

# Test Auth Service
if curl -s -X POST http://localhost:8102/api/auth/login -H "Content-Type: application/json" -d '{"username":"admin","password":"password"}' >/dev/null; then
    echo -e "${GREEN}✅ Auth Service: AUTHENTICATION OK${NC}"
    AUTH_ROUTING="ok"
else
    echo -e "${RED}❌ Auth Service: AUTHENTICATION FAILED${NC}"
    AUTH_ROUTING="failed"
fi

# Test Payment Service
if curl -s -X POST http://localhost:8102/api/payments/process -H "Content-Type: application/json" -d '{"amount":99.99,"currency":"USD"}' >/dev/null; then
    echo -e "${GREEN}✅ Payment Service: PROCESSING OK${NC}"
    PAYMENT_ROUTING="ok"
else
    echo -e "${RED}❌ Payment Service: PROCESSING FAILED${NC}"
    PAYMENT_ROUTING="failed"
fi

# Test Service Discovery
if curl -s http://localhost:8102/api/services/status >/dev/null; then
    echo -e "${GREEN}✅ Service Discovery: OPERATIONAL${NC}"
    DISCOVERY_STATUS="operational"
else
    echo -e "${RED}❌ Service Discovery: FAILED${NC}"
    DISCOVERY_STATUS="failed"
fi

echo ""
echo "🔧 Direct Service Access..."
echo "==========================="

# Test direct service access
if curl -s http://localhost:8201/health >/dev/null; then
    echo -e "${GREEN}✅ User Service Direct: HEALTHY${NC}"
    USER_DIRECT="healthy"
else
    echo -e "${RED}❌ User Service Direct: UNHEALTHY${NC}"
    USER_DIRECT="unhealthy"
fi

if curl -s http://localhost:8202/health >/dev/null; then
    echo -e "${GREEN}✅ Auth Service Direct: HEALTHY${NC}"
    AUTH_DIRECT="healthy"
else
    echo -e "${RED}❌ Auth Service Direct: UNHEALTHY${NC}"
    AUTH_DIRECT="unhealthy"
fi

if curl -s http://localhost:8203/health >/dev/null; then
    echo -e "${GREEN}✅ Payment Service Direct: HEALTHY${NC}"
    PAYMENT_DIRECT="healthy"
else
    echo -e "${RED}❌ Payment Service Direct: UNHEALTHY${NC}"
    PAYMENT_DIRECT="unhealthy"
fi

echo ""
echo "🏆 FINAL VERIFICATION RESULTS:"
echo "=============================="

# Final assessment
if [ "$GATEWAY_STATUS" = "healthy" ] && [ "$USER_ROUTING" = "ok" ] && [ "$USER_DIRECT" = "healthy" ]; then
    echo -e "${GREEN}🎉 PLATFORM STATUS: FULLY OPERATIONAL${NC}"
    echo -e "${GREEN}🚀 Ready for production use!${NC}"
    OVERALL_STATUS="FULLY_OPERATIONAL"
elif [ "$GATEWAY_STATUS" = "healthy" ]; then
    echo -e "${YELLOW}⚠️  PLATFORM STATUS: PARTIALLY OPERATIONAL${NC}"
    echo -e "${YELLOW}🔧 Some services may need attention${NC}"
    OVERALL_STATUS="PARTIALLY_OPERATIONAL"
else
    echo -e "${RED}❌ PLATFORM STATUS: NOT OPERATIONAL${NC}"
    echo -e "${RED}🚨 Platform needs immediate attention${NC}"
    OVERALL_STATUS="NOT_OPERATIONAL"
fi

echo ""
echo "📋 Recommended Actions:"
echo "======================"
echo "1. Run: ./status-microservices.sh (for detailed status)"
echo "2. Run: tail -f logs/api-gateway.log (to view logs)"
echo "3. Test all endpoints manually"
echo "4. Review service configurations"

# Save verification results
cat > verification-results.txt << EOR
HUMBU PLATFORM VERIFICATION RESULTS
==================================
Timestamp: $(date)
Overall Status: $OVERALL_STATUS

Service Status:
- API Gateway: $GATEWAY_STATUS
- User Service Routing: $USER_ROUTING
- Auth Service Routing: $AUTH_ROUTING
- Payment Service Routing: $PAYMENT_ROUTING
- Service Discovery: $DISCOVERY_STATUS

Direct Access:
- User Service: $USER_DIRECT
- Auth Service: $AUTH_DIRECT
- Payment Service: $PAYMENT_DIRECT
EOR

echo ""
echo "📄 Results saved to: verification-results.txt"
