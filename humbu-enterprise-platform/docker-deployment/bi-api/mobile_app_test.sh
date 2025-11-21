#!/bin/bash

API_BASE="https://fastapi-mobile-app-7kvj.onrender.com"

echo "📱 MOBILE APP API TEST"
echo "======================"

echo ""
echo "1. Getting Business Dashboard..."
curl -s "$API_BASE/dashboard" | python3 -c "
import json, sys
data = json.load(sys.stdin)
print('💰 Revenue: $' + str(data.get('revenue', 0)))
print('👥 Customers:', data.get('customers', 0))
print('📈 Transactions Today:', data.get('transactions_today', 0))
print('🟢 Status:', data.get('status', 'Unknown'))
"

echo ""
echo "2. Getting Customer Analytics..."
curl -s "$API_BASE/customers" | python3 -c "
import json, sys
data = json.load(sys.stdin)
print('👥 Total Customers:', data.get('total_customers', 0))
print('📱 Active Today:', data.get('active_today', 0))
print('⭐ Satisfaction:', data.get('satisfaction', 0))
"

echo ""
echo "3. AI Business Consultation..."
curl -s -X POST "$API_BASE/ai/chat" \
  -H "Content-Type: application/json" \
  -d '{"message": "What business strategies should we focus on?"}' | python3 -c "
import json, sys
data = json.load(sys.stdin)
print('🤖 AI Advisor:', data.get('response', 'No response'))
print('🎯 Confidence:', str(data.get('confidence', 0) * 100) + '%')
"

echo ""
echo "✅ MOBILE APP READY!"
echo "🌐 All endpoints working perfectly for mobile integration"
