from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import random
from datetime import datetime

app = FastAPI(title="AI Business Agent", description="Cloud AI Assistant")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "message": "🤖 Cloud AI Business Agent Running",
        "status": "online", 
        "timestamp": datetime.now().isoformat()
    }

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "service": "Cloud AI Business Agent",
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/ai/chat")
async def ai_chat(request: dict):
    user_message = request.get("message", "")
    
    business_responses = [
        "Your business shows excellent growth with $32K+ monthly revenue.",
        "Customer satisfaction at 4.9/5.0 indicates superb service quality.",
        "With 189 customers, you have strong foundation for expansion.",
        "Revenue trends are positive - consider scaling marketing efforts.",
        "Business analytics show all systems operational and trending upward.",
        "Based on current metrics, focus on customer retention strategies.",
        "Your revenue growth suggests market expansion opportunities.",
        "Consider implementing AI-driven customer insights for better targeting."
    ]
    
    return {
        "response": random.choice(business_responses),
        "user_message": user_message,
        "timestamp": datetime.now().isoformat(),
        "confidence": round(random.uniform(0.85, 0.98), 2),
        "source": "cloud_ai_agent"
    }

@app.get("/api/ai/analyze")
async def analyze_business():
    return {
        "analysis": "Business is performing excellently with strong growth metrics",
        "recommendations": [
            "Expand to new customer segments",
            "Increase digital marketing budget",
            "Launch loyalty program"
        ],
        "risk_level": "low",
        "timestamp": datetime.now().isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
