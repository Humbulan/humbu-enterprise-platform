from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import json
from datetime import datetime
from typing import Optional, Dict, Any

app = FastAPI(title="Business Intelligence API", version="11.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "🚀 Business Intelligence API v11.0.0 with AI & Smart Alerts", "status": "running"}

@app.get("/health")
async def health():
    return {
        "status": "healthy", 
        "service": "Business Intelligence API",
        "version": "11.0.0",
        "timestamp": datetime.now().isoformat(),
        "features": ["ai_chat", "trend_analysis", "smart_alerts"]
    }

# Current Business Metrics
CURRENT_METRICS = {
    'revenue': 32480.75,
    'customers': 189,
    'satisfaction': 4.9,
    'transactions': 111
}

# Alert Rules Configuration
ALERT_RULES = {
    'revenue': {'critical': 30000, 'warning': 33000, 'target': 35000},
    'customers': {'critical': 160, 'warning': 170, 'target': 200},
    'satisfaction': {'critical': 4.5, 'warning': 4.7, 'target': 5.0},
    'transactions': {'critical': 90, 'warning': 100, 'target': 120}
}

@app.get("/api/alerts")
async def get_alerts():
    """Provides a list of active alerts based on current metrics."""
    alerts = []
    
    # Revenue Alerts
    if CURRENT_METRICS['revenue'] < ALERT_RULES['revenue']['critical']:
        alerts.append({
            "metric": "Revenue", 
            "status": "CRITICAL", 
            "message": f"🚨 Revenue crisis! ${CURRENT_METRICS['revenue']:,.2f} is below ${ALERT_RULES['revenue']['critical']:,} baseline",
            "value": CURRENT_METRICS['revenue'],
            "threshold": ALERT_RULES['revenue']['critical'],
            "icon": "💰"
        })
    elif CURRENT_METRICS['revenue'] < ALERT_RULES['revenue']['warning']:
        alerts.append({
            "metric": "Revenue", 
            "status": "WARNING", 
            "message": f"⚠️ Revenue (${CURRENT_METRICS['revenue']:,.2f}) approaching target of ${ALERT_RULES['revenue']['target']:,}",
            "value": CURRENT_METRICS['revenue'],
            "threshold": ALERT_RULES['revenue']['target'],
            "icon": "💰"
        })
    elif CURRENT_METRICS['revenue'] >= ALERT_RULES['revenue']['target']:
        alerts.append({
            "metric": "Revenue", 
            "status": "SUCCESS", 
            "message": f"🎯 Revenue target achieved! ${CURRENT_METRICS['revenue']:,.2f} exceeds ${ALERT_RULES['revenue']['target']:,}",
            "value": CURRENT_METRICS['revenue'],
            "threshold": ALERT_RULES['revenue']['target'],
            "icon": "💰"
        })

    # Customer Alerts
    if CURRENT_METRICS['customers'] < ALERT_RULES['customers']['critical']:
        alerts.append({
            "metric": "Customers", 
            "status": "CRITICAL", 
            "message": f"🚨 Customer crisis! {CURRENT_METRICS['customers']} customers is below {ALERT_RULES['customers']['critical']} baseline",
            "value": CURRENT_METRICS['customers'],
            "threshold": ALERT_RULES['customers']['critical'],
            "icon": "👥"
        })
    elif CURRENT_METRICS['customers'] < ALERT_RULES['customers']['target']:
        alerts.append({
            "metric": "Customers", 
            "status": "WARNING", 
            "message": f"⚠️ Customers ({CURRENT_METRICS['customers']}) approaching target of {ALERT_RULES['customers']['target']}",
            "value": CURRENT_METRICS['customers'],
            "threshold": ALERT_RULES['customers']['target'],
            "icon": "👥"
        })
    else:
        alerts.append({
            "metric": "Customers", 
            "status": "SUCCESS", 
            "message": f"🎯 Customer target achieved! {CURRENT_METRICS['customers']} customers",
            "value": CURRENT_METRICS['customers'],
            "threshold": ALERT_RULES['customers']['target'],
            "icon": "👥"
        })

    # Satisfaction Alerts
    if CURRENT_METRICS['satisfaction'] < ALERT_RULES['satisfaction']['critical']:
        alerts.append({
            "metric": "Satisfaction", 
            "status": "CRITICAL", 
            "message": f"🚨 Satisfaction crisis! {CURRENT_METRICS['satisfaction']}/5 is below {ALERT_RULES['satisfaction']['critical']} threshold",
            "value": CURRENT_METRICS['satisfaction'],
            "threshold": ALERT_RULES['satisfaction']['critical'],
            "icon": "⭐"
        })
    elif CURRENT_METRICS['satisfaction'] < ALERT_RULES['satisfaction']['target']:
        alerts.append({
            "metric": "Satisfaction", 
            "status": "WARNING", 
            "message": f"⚠️ Satisfaction ({CURRENT_METRICS['satisfaction']}/5) approaching perfect score",
            "value": CURRENT_METRICS['satisfaction'],
            "threshold": ALERT_RULES['satisfaction']['target'],
            "icon": "⭐"
        })
    else:
        alerts.append({
            "metric": "Satisfaction", 
            "status": "SUCCESS", 
            "message": f"🎯 Perfect satisfaction! {CURRENT_METRICS['satisfaction']}/5 score",
            "value": CURRENT_METRICS['satisfaction'],
            "threshold": ALERT_RULES['satisfaction']['target'],
            "icon": "⭐"
        })

    # Transaction Alerts
    if CURRENT_METRICS['transactions'] < ALERT_RULES['transactions']['critical']:
        alerts.append({
            "metric": "Transactions", 
            "status": "CRITICAL", 
            "message": f"🚨 Transaction crisis! {CURRENT_METRICS['transactions']} transactions is below {ALERT_RULES['transactions']['critical']} baseline",
            "value": CURRENT_METRICS['transactions'],
            "threshold": ALERT_RULES['transactions']['critical'],
            "icon": "🛒"
        })
    elif CURRENT_METRICS['transactions'] < ALERT_RULES['transactions']['target']:
        alerts.append({
            "metric": "Transactions", 
            "status": "WARNING", 
            "message": f"⚠️ Transactions ({CURRENT_METRICS['transactions']}) approaching target of {ALERT_RULES['transactions']['target']}",
            "value": CURRENT_METRICS['transactions'],
            "threshold": ALERT_RULES['transactions']['target'],
            "icon": "🛒"
        })
    else:
        alerts.append({
            "metric": "Transactions", 
            "status": "SUCCESS", 
            "message": f"🎯 Transaction target achieved! {CURRENT_METRICS['transactions']} daily transactions",
            "value": CURRENT_METRICS['transactions'],
            "threshold": ALERT_RULES['transactions']['target'],
            "icon": "🛒"
        })

    # Overall system status
    critical_alerts = [a for a in alerts if a['status'] == 'CRITICAL']
    warning_alerts = [a for a in alerts if a['status'] == 'WARNING']
    
    if not critical_alerts and not warning_alerts:
        alerts.insert(0, {
            "metric": "System", 
            "status": "SUCCESS", 
            "message": "✅ All Key Business Metrics are within target ranges",
            "icon": "🎯"
        })
    
    return {
        "current_metrics": CURRENT_METRICS,
        "alert_rules": ALERT_RULES,
        "alerts": alerts,
        "summary": {
            "total_alerts": len(alerts),
            "critical": len(critical_alerts),
            "warnings": len(warning_alerts),
            "success": len([a for a in alerts if a['status'] == 'SUCCESS']),
            "system_status": "CRITICAL" if critical_alerts else "WARNING" if warning_alerts else "HEALTHY"
        },
        "timestamp": datetime.now().isoformat()
    }

# AI Chat Endpoint (keeping your existing functionality)
@app.post("/ai/chat")
async def universal_ai_chat(request: Dict[Any, Any] = Body(...)):
    """Universal AI Business Advisor - Handles all types of questions with data-aware context"""
    try:
        user_message = request.get("message", "")
        
        if not user_message:
            raise HTTPException(status_code=400, detail="Message is required")

        print(f"🤖 AI Chat Request: {user_message[:100]}...")

        # Generate intelligent response based on question type
        response = generate_ai_response(user_message, CURRENT_METRICS)
        
        return {
            "status": "success",
            "response": response,
            "context_used": True,
            "timestamp": datetime.now().isoformat()
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI processing error: {str(e)}")

def generate_ai_response(question: str, context: Dict) -> str:
    """Generate intelligent, context-aware AI responses"""
    
    question_lower = question.lower()
    revenue = context['revenue']
    customers = context['customers']
    satisfaction = context['satisfaction']
    transactions = context['transactions']

    # Business strategy questions
    if any(word in question_lower for word in ['revenue', 'income', 'money', 'sales']):
        return f"💰 **Revenue Strategy** (Current: ${revenue:,.2f})\n\nWith your {satisfaction}/5 customer satisfaction and {customers} loyal customers, focus on:\n\n• **Upselling Premium Services**: Bundle existing offerings\n• **Referral Program**: Leverage happy customers for new business\n• **Price Optimization**: Test tiered pricing models\n• **Customer Retention**: Increase lifetime value through loyalty programs"

    elif any(word in question_lower for word in ['customer', 'client', 'user', 'people']):
        return f"👥 **Customer Growth Strategy** (Current: {customers} customers)\n\nWith your outstanding {satisfaction}/5 satisfaction score:\n\n• **Referral Program**: Offer incentives for customer referrals\n• **Content Marketing**: Create valuable content to attract ideal customers\n• **Partnerships**: Collaborate with complementary businesses\n• **Social Proof**: Showcase customer testimonials and case studies"

    elif any(word in question_lower for word in ['growth', 'expand', 'scale', 'strategy']):
        return f"🚀 **Comprehensive Growth Strategy**\n\n**Based on your metrics**:\n• Revenue: ${revenue:,.2f}\n• Customers: {customers}\n• Satisfaction: {satisfaction}/5\n• Transactions: {transactions}\n\n**Growth Framework**:\n1. **Product Expansion**: Develop premium service tiers\n2. **Market Penetration**: Increase market share in current segments\n3. **Customer Retention**: Improve retention rates\n4. **Strategic Partnerships**: Build complementary alliances\n\nYour {satisfaction}/5 satisfaction is your superpower!"

    elif any(word in question_lower for word in ['satisfaction', 'happy', 'rating', 'review']):
        return f"⭐ **Customer Satisfaction Excellence** (Current: {satisfaction}/5)\n\n**Maintenance Strategy**:\n• **Proactive Support**: Reach out before issues arise\n• **Personalized Communication**: Use customer names and history\n• **Quick Response Times**: Aim for < 1 hour response\n• **Continuous Improvement**: Regularly update based on feedback"

    # Technical questions
    elif any(word in question_lower for word in ['html', 'code', 'website', 'web', 'page']):
        return f"🌐 **Website Development Guidance**\n\nI'd be happy to help you create a website! Based on your business context (${revenue:,.2f} revenue, {customers} customers), here's a comprehensive approach:\n\n**Modern Website Stack**:\n- Frontend: HTML5, CSS3, JavaScript\n- Framework: React/Vue.js for dynamic features\n- Backend: Node.js/Python for business logic\n- Database: PostgreSQL/MongoDB\n- Hosting: Vercel/Netlify\n\nI can provide specific code examples for any of these components!"

    # Alert-related questions
    elif any(word in question_lower for word in ['alert', 'warning', 'critical', 'problem', 'issue']):
        return f"🚨 **Alert Analysis**\n\nBased on your current metrics:\n• Revenue: ${revenue:,.2f} (Target: >$35,000)\n• Customers: {customers} (Target: >200)\n• Satisfaction: {satisfaction}/5 (Target: 5.0)\n• Transactions: {transactions} (Target: >120)\n\n**Areas needing attention**:\n- Revenue below $35K target\n- Customer count below 200 target\n- Transactions below 120 target\n\nAsk me about specific metrics for improvement strategies!"

    # General/creative questions
    elif any(word in question_lower for word in ['help', 'assist', 'support']):
        return f"🎯 **How I Can Help**\n\nI'm your Universal AI Business Advisor! I can assist with:\n\n• **Business Strategy**: Revenue growth, customer acquisition, market expansion\n• **Technical Development**: Website creation, code generation, API integration\n• **Data Analysis**: Trend interpretation, forecasting, performance insights\n• **Alert Management**: Threshold monitoring, issue resolution\n• **Creative Solutions**: Marketing ideas, innovation strategies\n\nWhat specific challenge would you like to tackle today?"

    # Default response for any other question
    else:
        return f"🤔 **Comprehensive Analysis**\n\nI've analyzed your question in the context of your business success (${revenue:,.2f} revenue, {customers} customers, {satisfaction}/5 satisfaction).\n\nWhile your question doesn't fit a specific business category, I can provide insights drawing from business strategy, technical implementation, customer experience optimization, and creative thinking.\n\nPlease feel free to ask follow-up questions, and I'll tailor my response to your specific needs!"

# Existing trend endpoints (keeping your current functionality)
@app.get("/api/trends/revenue")
async def get_revenue_trends():
    return {
        "title": "30-Day Revenue Trend",
        "metric": "revenue", 
        "current_value": 32480,
        "data": [
            {"date": "2025-10-12", "value": 29550},
            {"date": "2025-10-13", "value": 29943},
        ],
        "forecast": {
            "date": "2025-11-17", 
            "value": 32716,
            "message": "AI forecasts revenue to reach $32,716 next week"
        },
        "analysis": {
            "growth_rate": "+8.7%",
            "trend": "upward", 
            "confidence": "high"
        }
    }

@app.get("/api/trends/all")
async def get_all_trends():
    return {
        "message": "🚀 Business Intelligence API v11.0.0 with AI & Smart Alerts",
        "status": "running",
        "features": ["trend_analysis", "ai_forecasting", "smart_alerts", "ai_chat"]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
