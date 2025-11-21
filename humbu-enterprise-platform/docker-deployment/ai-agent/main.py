from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="HWDIA AI Agent")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str
    status: str

@app.get("/health")
async def health_check():
    return {"service": "HWDIA AI Agent", "status": "healthy"}

@app.get("/")
async def root():
    return {"message": "HWDIA AI Agent is running"}

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    # This single endpoint handles requests from the API Gateway
    return ChatResponse(
        response=f"🚀 Humbu AI Response: I received your message '{request.message}'. The unified platform is working!",
        status="success"
    )

if __name__ == "__main__":
    # 💡 CHANGE: Run on internal port 8000 for Docker
    uvicorn.run(app, host="0.0.0.0", port=8000)
