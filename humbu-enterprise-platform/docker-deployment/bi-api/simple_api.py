from fastapi import FastAPI
app = FastAPI()
@app.get("/")
def root(): return {"message": "FastAPI Clean", "status": "running"}
@app.get("/health")
def health(): return {"status": "healthy"}
