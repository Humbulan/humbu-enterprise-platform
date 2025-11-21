from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import json
from datetime import datetime
from typing import Optional, Dict, Any
import random

app = FastAPI(title="Business Intelligence API", version="12.0.0")

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
    return {"message": "🚀 Business Intelligence API v12.0.0 with Smart AI", "status": "running"}

@app.get("/health")
async def health():
    return {
        "status": "healthy", 
        "service": "Business Intelligence API",
        "version": "12.0.0",
        "timestamp": datetime.now().isoformat(),
        "features": ["smart_ai_chat", "trend_analysis", "smart_alerts"]
    }

# Current Business Metrics
CURRENT_METRICS = {
    'revenue': 32480.75,
    'customers': 189,
    'satisfaction': 4.9,
    'transactions': 111
}

# Enhanced AI Chat Endpoint with Diverse Responses
@app.post("/ai/chat")
async def smart_ai_chat(request: Dict[Any, Any] = Body(...)):
    """Smart AI Business Advisor - Provides diverse, context-aware responses"""
    try:
        user_message = request.get("message", "").strip().lower()
        
        if not user_message:
            raise HTTPException(status_code=400, detail="Message is required")

        print(f"🤖 Smart AI Request: {user_message[:100]}...")

        # Generate intelligent, diverse response based on question type
        response = generate_smart_response(user_message)
        
        return {
            "status": "success",
            "response": response,
            "context_used": True,
            "timestamp": datetime.now().isoformat()
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI processing error: {str(e)}")

def generate_smart_response(question: str) -> str:
    """Generate diverse, intelligent responses based on question type"""
    
    # Revenue-related questions
    if any(word in question for word in ['revenue', 'income', 'money', 'sales', 'profit']):
        responses = [
            f"💰 **Revenue Growth Strategy**\n\nYour current revenue of ${CURRENT_METRICS['revenue']:,.2f} shows strong performance. To accelerate growth:\n\n• **Premium Tier Expansion**: Introduce high-margin service packages\n• **Customer Lifetime Value**: Focus on retention to increase LTV by 25%\n• **Strategic Partnerships**: Collaborate with complementary service providers\n• **Upsell Automation**: Implement targeted upsell campaigns",
            
            f"📈 **Revenue Optimization**\n\nWith ${CURRENT_METRICS['revenue']:,.2f} in monthly revenue and excellent {CURRENT_METRICS['satisfaction']}/5 customer satisfaction:\n\n**Immediate Actions**:\n1. Analyze your top 20% customers for premium offerings\n2. Implement referral program with existing {CURRENT_METRICS['customers']} customers\n3. Test price increases on most popular services\n4. Create bundled service packages",
            
            f"💡 **Revenue Acceleration Plan**\n\n**Current Status**: ${CURRENT_METRICS['revenue']:,.2f} monthly, {CURRENT_METRICS['customers']} customers\n\n**Growth Levers**:\n• **Product-Market Fit**: Your {CURRENT_METRICS['satisfaction']}/5 satisfaction indicates strong fit\n• **Pricing Strategy**: Consider value-based pricing models\n• **Sales Efficiency**: Optimize conversion funnels\n• **Market Expansion**: Target adjacent customer segments"
        ]
        return random.choice(responses)

    # Customer-related questions
    elif any(word in question for word in ['customer', 'client', 'user', 'people', 'acquisition', 'acquir']):
        responses = [
            f"👥 **Customer Acquisition Strategy**\n\nWith {CURRENT_METRICS['customers']} loyal customers and {CURRENT_METRICS['satisfaction']}/5 satisfaction, focus on:\n\n• **Referral Program**: Leverage happy customers to bring new business\n• **Content Marketing**: Create valuable content that attracts ideal customers\n• **Partnership Marketing**: Collaborate with non-competing businesses\n• **Social Proof**: Showcase customer success stories and testimonials",
            
            f"🚀 **Customer Growth Framework**\n\n**Current Base**: {CURRENT_METRICS['customers']} customers\n**Satisfaction**: {CURRENT_METRICS['satisfaction']}/5 (excellent foundation)\n\n**Acquisition Channels**:\n1. **Referral System**: Turn customers into advocates\n2. **SEO Optimization**: Improve search visibility\n3. **Community Building**: Create customer forums/groups\n4. **Strategic Alliances**: Partner with complementary services",
            
            f"🎯 **Customer Expansion Plan**\n\nYour {CURRENT_METRICS['customers']} customer base with {CURRENT_METRICS['satisfaction']}/5 satisfaction is prime for growth:\n\n**Tactical Approach**:\n• **Ideal Customer Profile**: Double down on your best customer segments\n• **Channel Optimization**: Focus on highest-converting acquisition channels\n• **Retention First**: Improve retention before major acquisition spend\n• **Customer Advocacy**: Empower satisfied customers to refer others"
        ]
        return random.choice(responses)

    # Growth strategy questions
    elif any(word in question for word in ['growth', 'expand', 'scale', 'strategy', 'plan']):
        responses = [
            f"🚀 **Comprehensive Growth Strategy**\n\n**Based on your metrics**:\n• Revenue: ${CURRENT_METRICS['revenue']:,.2f}\n• Customers: {CURRENT_METRICS['customers']}\n• Satisfaction: {CURRENT_METRICS['satisfaction']}/5\n• Transactions: {CURRENT_METRICS['transactions']}\n\n**Growth Framework**:\n1. **Product Excellence**: Maintain your {CURRENT_METRICS['satisfaction']}/5 quality\n2. **Customer Expansion**: Grow from {CURRENT_METRICS['customers']} to 250+ customers\n3. **Revenue Diversification**: Add new service lines\n4. **Operational Efficiency**: Scale without quality loss",
            
            f"📊 **Strategic Growth Plan**\n\n**Current Position**: Strong with ${CURRENT_METRICS['revenue']:,.2f} revenue and {CURRENT_METRICS['satisfaction']}/5 satisfaction\n\n**Growth Pillars**:\n• **Customer-Centric Innovation**: Continue delighting your {CURRENT_METRICS['customers']} customers\n• **Market Leadership**: Establish authority in your niche\n• **Technology Enablement**: Leverage tools for scalability\n• **Team Development**: Build capacity for growth",
            
            f"🎪 **Scalable Growth Model**\n\n**Foundation**: ${CURRENT_METRICS['revenue']:,.2f} revenue, {CURRENT_METRICS['customers']} customers, {CURRENT_METRICS['satisfaction']}/5 rating\n\n**Expansion Strategy**:\n• **Vertical Growth**: Increase spend from existing customers\n• **Horizontal Growth**: Add new customer segments\n• **Geographic Expansion**: Consider new markets\n• **Product Innovation**: Develop adjacent offerings"
        ]
        return random.choice(responses)

    # Technical/website questions
    elif any(word in question for word in ['website', 'web', 'html', 'code', 'build', 'create website']):
        responses = [
            f"🌐 **Website Development Strategy**\n\nBased on your business (${CURRENT_METRICS['revenue']:,.2f} revenue, {CURRENT_METRICS['customers']} customers), here's your website plan:\n\n**Technical Stack**:\n• Frontend: React/Next.js for dynamic features\n• Backend: Node.js/Python API\n• Database: PostgreSQL\n• Hosting: Vercel/Netlify\n• CMS: Contentful/Sanity\n\n**Key Pages**: Home, Services, Portfolio, Testimonials, Contact",
            
            f"💻 **Professional Website Build**\n\n**For your ${CURRENT_METRICS['revenue']:,.2f} revenue business**:\n\n**Development Approach**:\n1. **Mobile-First Design**: Responsive across all devices\n2. **SEO Optimization**: Built-in search engine optimization\n3. **Fast Performance**: < 3-second load times\n4. **Conversion Focus**: Clear calls-to-action\n5. **Analytics Integration**: Track user behavior\n\nI can provide specific code templates!",
            
            f"🎨 **Website Creation Plan**\n\n**Business Context**: ${CURRENT_METRICS['revenue']:,.2f} revenue, {CURRENT_METRICS['customers']} customers\n\n**Development Phases**:\n• **Phase 1**: Basic landing page with contact form\n• **Phase 2**: Service pages and portfolio\n• **Phase 3**: Customer portal and booking system\n• **Phase 4**: E-commerce integration\n\nWant me to generate specific HTML/CSS code?"
        ]
        return random.choice(responses)

    # Marketing questions
    elif any(word in question for word in ['market', 'promot', 'advert', 'brand', 'social media']):
        responses = [
            f"📢 **Marketing Strategy**\n\nWith {CURRENT_METRICS['customers']} customers and {CURRENT_METRICS['satisfaction']}/5 satisfaction:\n\n**Marketing Channels**:\n• **Content Marketing**: Educate your audience\n• **Email Marketing**: Nurture leads and customers\n• **Social Proof**: Leverage customer testimonials\n• **Partnerships**: Cross-promote with aligned businesses\n• **SEO**: Organic search visibility",
            
            f"🎯 **Digital Marketing Plan**\n\n**For your ${CURRENT_METRICS['revenue']:,.2f} revenue business**:\n\n**Tactical Approach**:\n1. **Customer Research**: Understand buyer journey\n2. **Channel Selection**: Focus on highest-ROI channels\n3. **Content Strategy**: Create valuable, shareable content\n4. **Conversion Optimization**: Improve lead-to-customer rate\n5. **Analytics**: Measure and optimize campaigns",
            
            f"🚀 **Growth Marketing Framework**\n\n**Current Assets**: {CURRENT_METRICS['customers']} customers, {CURRENT_METRICS['satisfaction']}/5 rating\n\n**Marketing Stack**:\n• **Awareness**: SEO, content, social media\n• **Acquisition**: Paid ads, partnerships, referrals\n• **Activation**: Onboarding, free trials\n• **Retention**: Email, loyalty programs\n• **Revenue**: Upsells, cross-sells"
        ]
        return random.choice(responses)

    # Satisfaction questions
    elif any(word in question for word in ['satisfaction', 'happy', 'review', 'rating', 'feedback']):
        responses = [
            f"⭐ **Customer Satisfaction Excellence**\n\nYour {CURRENT_METRICS['satisfaction']}/5 satisfaction score is outstanding! Maintain this with:\n\n**Best Practices**:\n• **Proactive Communication**: Regular check-ins with customers\n• **Quick Issue Resolution**: < 24-hour response times\n• **Personalized Service**: Use customer names and history\n• **Continuous Improvement**: Regular feedback collection\n• **Employee Training**: Ensure staff understands customer needs",
            
            f"🎉 **Satisfaction Maintenance Plan**\n\n**Current Score**: {CURRENT_METRICS['satisfaction']}/5 (excellent!)\n\n**Retention Strategies**:\n1. **Customer Success Team**: Dedicated support resources\n2. **Quality Assurance**: Maintain service standards\n3. **Innovation**: Regularly add new value\n4. **Community Building**: Create customer networks\n5. **Recognition**: Reward loyal customers",
            
            f"💫 **Customer Experience Optimization**\n\nWith {CURRENT_METRICS['satisfaction']}/5 satisfaction across {CURRENT_METRICS['customers']} customers:\n\n**Experience Enhancements**:\n• **Onboarding Process**: Smooth customer introduction\n• **Support Channels**: Multiple contact options\n• **Product Education**: Help customers get maximum value\n• **Feedback Loops**: Regular satisfaction surveys\n• **Surprise Delights**: Unexpected positive experiences"
        ]
        return random.choice(responses)

    # General help questions
    elif any(word in question for word in ['help', 'assist', 'support', 'advice']):
        responses = [
            f"🎯 **How I Can Help**\n\nI'm your Smart AI Business Advisor! I specialize in:\n\n• **Business Strategy**: Revenue growth, customer acquisition, scaling\n• **Technical Development**: Website creation, automation, systems\n• **Marketing & Sales**: Channel strategy, conversion optimization\n• **Operations**: Efficiency, process improvement\n• **Data Analysis**: Metrics interpretation, forecasting\n\nWhat specific area would you like to explore?",
            
            f"🤝 **Business Advisory Services**\n\nBased on your current metrics (${CURRENT_METRICS['revenue']:,.2f} revenue, {CURRENT_METRICS['customers']} customers), I can help with:\n\n**Strategic Planning**:\n• Growth roadmap development\n• Market expansion strategies\n• Competitive positioning\n\n**Operational Excellence**:\n• Process optimization\n• Technology implementation\n• Team structure planning\n\nWhere shall we start?",
            
            f"🚀 **Comprehensive Business Support**\n\nYour business foundation is strong with ${CURRENT_METRICS['revenue']:,.2f} revenue and {CURRENT_METRICS['customers']} satisfied customers.\n\n**I can assist with**:\n• **Financial Planning**: Revenue optimization, cost management\n• **Customer Growth**: Acquisition strategies, retention programs\n• **Product Development**: Service expansion, feature prioritization\n• **Marketing Strategy**: Channel selection, campaign planning\n\nWhat's your most pressing business challenge?"
        ]
        return random.choice(responses)

    # Default response for unrecognized questions
    else:
        responses = [
            f"🤔 **Business Analysis**\n\nI've analyzed your question about '{question}' in the context of your business performance:\n\n• Revenue: ${CURRENT_METRICS['revenue']:,.2f}\n• Customers: {CURRENT_METRICS['customers']}\n• Satisfaction: {CURRENT_METRICS['satisfaction']}/5\n• Transactions: {CURRENT_METRICS['transactions']}\n\nYour business shows strong fundamentals. Could you provide more specific details about what you'd like to achieve?",
            
            f"💡 **Strategic Insight**\n\nBased on your query and current business metrics, I recommend focusing on:\n\n1. **Leveraging Your Strengths**: Your {CURRENT_METRICS['satisfaction']}/5 satisfaction is a major asset\n2. **Growth Opportunities**: With {CURRENT_METRICS['customers']} customers, referral programs could be powerful\n3. **Revenue Optimization**: ${CURRENT_METRICS['revenue']:,.2f} provides a solid foundation for expansion\n\nWhat specific outcome are you targeting?",
            
            f"🎯 **Contextual Guidance**\n\nI understand you're asking about '{question}'. Given your business context:\n\n• Strong customer satisfaction ({CURRENT_METRICS['satisfaction']}/5)\n• Solid revenue base (${CURRENT_METRICS['revenue']:,.2f})\n• Loyal customer following ({CURRENT_METRICS['customers']} customers)\n\nI can provide more targeted advice if you specify your goals. Are you looking for strategic, technical, or operational guidance?"
        ]
        return random.choice(responses)

# Keep your existing alert and trend endpoints
@app.get("/api/alerts")
async def get_alerts():
    """Smart alert endpoint"""
    return {
        "current_metrics": CURRENT_METRICS,
        "alerts": [
            {
                "metric": "Revenue", 
                "status": "WARNING", 
                "message": f"Revenue (${CURRENT_METRICS['revenue']:,.2f}) below $35,000 target",
                "icon": "💰"
            },
            {
                "metric": "Customers", 
                "status": "WARNING", 
                "message": f"Customers ({CURRENT_METRICS['customers']}) below 200 target",
                "icon": "👥"
            },
            {
                "metric": "Satisfaction", 
                "status": "SUCCESS", 
                "message": f"Excellent satisfaction: {CURRENT_METRICS['satisfaction']}/5",
                "icon": "⭐"
            }
        ],
        "summary": {
            "total_alerts": 3,
            "critical": 0,
            "warnings": 2,
            "success": 1,
            "system_status": "HEALTHY"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
