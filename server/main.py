from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.database.config import Base, engine
from src.users.controller import router as users_router
from src.shoutouts.controller import router as shoutouts_router
from dotenv import load_dotenv
import os

load_dotenv()

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="BragBoard API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(users_router, prefix="/api", tags=["Users"])
app.include_router(shoutouts_router, prefix="/api", tags=["Shoutouts"])

@app.get("/")
def root():
    base_url = os.getenv("BASE_URL", "http://localhost:8000")
    return {
        "message": "BragBoard API is running",
        "version": "1.0.0",
        "base_url": base_url,
        "docs": f"{base_url}/docs",
        "endpoints": {
            "users": f"{base_url}/api/users",
            "shoutouts": f"{base_url}/api/shoutouts"
        }
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "BragBoard API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
