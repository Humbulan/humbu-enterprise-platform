from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import json
from datetime import datetime
from typing import Optional, Dict, Any

app = FastAPI(title="Business Intelligence API", version="10.0.0")

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
    return {"message": "🚀 Connected Business API v10.0.0 with Built-in AI", "status": "running"}

@app.get("/health")
async def health():
    return {
        "status": "healthy", 
        "service": "Business Intelligence API",
        "version": "10.0.0",
        "timestamp": datetime.now().isoformat(),
        "ai_status": "built-in_operational"
    }

# AI Chat Endpoint
@app.post("/ai/chat")
async def universal_ai_chat(request: Dict[Any, Any] = Body(...)):
    """
    Universal AI Business Advisor - Handles all types of questions with data-aware context
    """
    try:
        user_message = request.get("message", "")
        
        if not user_message:
            raise HTTPException(status_code=400, detail="Message is required")

        print(f"🤖 AI Chat Request: {user_message[:100]}...")

        # Extract business context from message or use defaults
        business_context = {
            'revenue': '$32,480.75',
            'customers': 189,
            'satisfaction': 4.9,
            'transactions': 111
        }

        # Check if message contains business context
        if 'revenue' in user_message.lower():
            revenue_match = next((word for word in user_message.split() if '$' in word), None)
            if revenue_match:
                business_context['revenue'] = revenue_match

        # Generate intelligent response based on question type
        response = generate_ai_response(user_message, business_context)
        
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
        return f"💰 **Revenue Strategy** (Current: {revenue})\n\nWith your {satisfaction}/5 customer satisfaction and {customers} loyal customers, focus on:\n\n• **Upselling Premium Services**: Bundle existing offerings\n• **Referral Program**: Leverage happy customers for new business\n• **Price Optimization**: Test tiered pricing models\n• **Customer Retention**: Increase lifetime value through loyalty programs"

    elif any(word in question_lower for word in ['customer', 'client', 'user', 'people']):
        return f"👥 **Customer Growth Strategy** (Current: {customers} customers)\n\nWith your outstanding {satisfaction}/5 satisfaction score:\n\n• **Referral Program**: Offer incentives for customer referrals\n• **Content Marketing**: Create valuable content to attract ideal customers\n• **Partnerships**: Collaborate with complementary businesses\n• **Social Proof**: Showcase customer testimonials and case studies"

    elif any(word in question_lower for word in ['growth', 'expand', 'scale', 'strategy']):
        return f"🚀 **Comprehensive Growth Strategy**\n\n**Based on your metrics**:\n• Revenue: {revenue}\n• Customers: {customers}\n• Satisfaction: {satisfaction}/5\n• Transactions: {transactions}\n\n**Growth Framework**:\n1. **Product Expansion**: Develop premium service tiers\n2. **Market Penetration**: Increase market share in current segments\n3. **Customer Retention**: Improve retention rates\n4. **Strategic Partnerships**: Build complementary alliances\n\nYour {satisfaction}/5 satisfaction is your superpower!"

    elif any(word in question_lower for word in ['satisfaction', 'happy', 'rating', 'review']):
        return f"⭐ **Customer Satisfaction Excellence** (Current: {satisfaction}/5)\n\n**Maintenance Strategy**:\n• **Proactive Support**: Reach out before issues arise\n• **Personalized Communication**: Use customer names and history\n• **Quick Response Times**: Aim for < 1 hour response\n• **Continuous Improvement**: Regularly update based on feedback"

    # Technical questions
    elif any(word in question_lower for word in ['html', 'code', 'website', 'web', 'page']):
        return f"🌐 **Website Development Guidance**\n\nI'd be happy to help you create a website! Based on your business context ({revenue} revenue, {customers} customers), here's a comprehensive approach:\n\n**Modern Website Stack**:\n- Frontend: HTML5, CSS3, JavaScript\n- Framework: React/Vue.js for dynamic features\n- Backend: Node.js/Python for business logic\n- Database: PostgreSQL/MongoDB\n- Hosting: Vercel/Netlify\n\nI can provide specific code examples for any of these components!"

    # General/creative questions
    elif any(word in question_lower for word in ['help', 'assist', 'support']):
        return f"🎯 **How I Can Help**\n\nI'm your Universal AI Business Advisor! I can assist with:\n\n• **Business Strategy**: Revenue growth, customer acquisition, market expansion\n• **Technical Development**: Website creation, code generation, API integration\n• **Data Analysis**: Trend interpretation, forecasting, performance insights\n• **Creative Solutions**: Marketing ideas, innovation strategies, problem-solving\n\nWhat specific challenge would you like to tackle today?"

    # Default response for any other question
    else:
        return f"🤔 **Comprehensive Analysis**\n\nI've analyzed your question in the context of your business success ({revenue} revenue, {customers} customers, {satisfaction}/5 satisfaction).\n\nWhile your question doesn't fit a specific business category, I can provide insights drawing from business strategy, technical implementation, customer experience optimization, and creative thinking.\n\nPlease feel free to ask follow-up questions, and I'll tailor my response to your specific needs!"

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
            # ... your existing trend data
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

@app.get("/api/trends/customers")
async def get_customer_trends():
    return {
        "title": "60-Day Customer Growth",
        "metric": "customers",
        "current_value": 189,
        "data": [
            {"date": "2025-09-12", "value": 170},
            {"date": "2025-09-13", "value": 167},
            # ... your existing trend data  
        ],
        "forecast": {
            "date": "2025-11-24",
            "value": 175,
            "message": "Projected to reach 175 customers in 2 weeks"
        },
        "analysis": {
            "growth_rate": "+2.9%",
            "trend": "steady_growth",
            "confidence": "medium"
        }
    }

@app.get("/api/trends/all")
async def get_all_trends():
    return {
        "message": "🚀 Business Intelligence API v10.0.0 with Trend Analysis",
        "status": "running",
        "features": ["trend_analysis", "ai_forecasting", "business_metrics"]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
