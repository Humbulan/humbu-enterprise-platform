from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import date, timedelta
import random
from pydantic import BaseModel

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
    return {
        "message": "🚀 Business Intelligence API v10.0.0 with Trend Analysis",
        "status": "running",
        "features": ["trend_analysis", "ai_forecasting", "business_metrics"]
    }

@app.get("/health")
async def health():
    return {
        "status": "healthy", 
        "service": "Business Intelligence API",
        "version": "10.0.0",
        "timestamp": str(date.today()),
        "endpoints": ["/api/trends/revenue", "/api/trends/customers", "/api/trends/satisfaction", "/api/trends/transactions"]
    }

@app.post("/ai/chat")
async def ai_chat(request: dict):
    """AI chat endpoint with business context"""
    user_message = request.get("message", "")
    
    # Enhanced response with trend awareness
    response = f"I've analyzed your query about business trends. {user_message} - Based on current metrics and historical patterns, I can provide data-driven insights and forecasts."
    
    return {"response": response}

# --- TREND ANALYSIS ENDPOINTS ---

def generate_mock_trend_data(days: int, base_value: float, trend_factor: float, metric_name: str):
    """Generates realistic historical data for charting."""
    data = []
    today = date.today()
    
    for i in range(days):
        day = today - timedelta(days=days - i - 1)
        
        # Create realistic trend patterns
        if metric_name == "revenue":
            # Revenue: steady growth with some fluctuations
            value = base_value + (i * trend_factor) + random.randint(-300, 300)
            value = max(28000, round(value))
        elif metric_name == "customers":
            # Customers: gradual growth
            value = base_value + (i * trend_factor/8) + random.randint(-3, 5)
            value = max(150, round(value))
        elif metric_name == "satisfaction":
            # Satisfaction: high with small variations
            value = base_value + (i * trend_factor/200) + random.randint(-15, 15)/100
            value = max(4.5, min(5.0, round(value, 2)))
        else:  # transactions
            # Transactions: daily variations with growth
            value = base_value + (i * trend_factor/3) + random.randint(-12, 15)
            value = max(80, round(value))
            
        data.append({
            "date": day.strftime("%Y-%m-%d"),
            "value": value
        })
    return data

@app.get("/api/trends/revenue")
def get_revenue_trends():
    """Returns 30 days of revenue trend data with forecast."""
    historical_data = generate_mock_trend_data(30, 29800, 90.0, "revenue")
    
    # AI Forecast based on trend
    last_value = historical_data[-1]['value']
    trend_growth = (historical_data[-1]['value'] - historical_data[0]['value']) / len(historical_data)
    forecast_value = round(last_value + (trend_growth * 7))  # 7-day projection
    
    return {
        "title": "30-Day Revenue Trend",
        "metric": "revenue",
        "current_value": 32480,
        "data": historical_data,
        "forecast": {
            "date": (date.today() + timedelta(days=7)).strftime("%Y-%m-%d"),
            "value": forecast_value,
            "message": f"AI forecasts revenue to reach ${forecast_value:,} next week"
        },
        "analysis": {
            "growth_rate": f"+{((last_value - historical_data[0]['value']) / historical_data[0]['value'] * 100):.1f}%",
            "trend": "upward",
            "confidence": "high"
        }
    }

@app.get("/api/trends/customers")
def get_customer_trends():
    """Returns 60 days of customer growth data."""
    historical_data = generate_mock_trend_data(60, 165, 0.8, "customers")
    
    last_value = historical_data[-1]['value']
    forecast_value = last_value + 6  # Conservative weekly growth
    
    return {
        "title": "60-Day Customer Growth",
        "metric": "customers", 
        "current_value": 189,
        "data": historical_data,
        "forecast": {
            "date": (date.today() + timedelta(days=14)).strftime("%Y-%m-%d"),
            "value": forecast_value,
            "message": f"Projected to reach {forecast_value} customers in 2 weeks"
        },
        "analysis": {
            "growth_rate": f"+{((last_value - historical_data[0]['value']) / historical_data[0]['value'] * 100):.1f}%",
            "trend": "steady_growth",
            "confidence": "medium"
        }
    }

@app.get("/api/trends/satisfaction")
def get_satisfaction_trends():
    """Returns 30 days of satisfaction data."""
    historical_data = generate_mock_trend_data(30, 4.7, 0.08, "satisfaction")
    
    return {
        "title": "30-Day Satisfaction Trend", 
        "metric": "satisfaction",
        "current_value": 4.9,
        "data": historical_data,
        "forecast": {
            "date": (date.today() + timedelta(days=7)).strftime("%Y-%m-%d"),
            "value": 4.92,
            "message": "Maintaining excellent customer satisfaction levels"
        },
        "analysis": {
            "growth_rate": "stable",
            "trend": "consistent",
            "confidence": "high"
        }
    }

@app.get("/api/trends/transactions")
def get_transaction_trends():
    """Returns 14 days of transaction data."""
    historical_data = generate_mock_trend_data(14, 95, 2.2, "transactions")
    
    last_value = historical_data[-1]['value']
    forecast_value = last_value + 7
    
    return {
        "title": "14-Day Transaction Trend",
        "metric": "transactions", 
        "current_value": 111,
        "data": historical_data,
        "forecast": {
            "date": (date.today() + timedelta(days=3)).strftime("%Y-%m-%d"),
            "value": forecast_value,
            "message": f"Expected to reach {forecast_value} daily transactions"
        },
        "analysis": {
            "growth_rate": f"+{((last_value - historical_data[0]['value']) / historical_data[0]['value'] * 100):.1f}%",
            "trend": "volatile_growth",
            "confidence": "medium"
        }
    }

@app.get("/api/trends/all")
def get_all_trends():
    """Returns all trend data in one endpoint."""
    return {
        "revenue": get_revenue_trends(),
        "customers": get_customer_trends(), 
        "satisfaction": get_satisfaction_trends(),
        "transactions": get_transaction_trends()
    }

# Business metrics endpoint
@app.get("/api/metrics/current")
def get_current_metrics():
    """Returns current business metrics."""
    return {
        "revenue": 32480.75,
        "customers": 189,
        "satisfaction": 4.9,
        "transactions": 111,
        "timestamp": str(date.today())
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
