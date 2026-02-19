from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.auth.controller import router as auth_router
from src.database.connection import engine, Base

# Import the new dashboard routers
from src.api.analytics import router as analytics_router
from src.api.users import router as users_router
from src.api.logs import router as logs_router

# Create Database Tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="BragBoard API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://127.0.0.1:5500", "null"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register All Routes
app.include_router(auth_router)
app.include_router(analytics_router)
app.include_router(users_router)
app.include_router(logs_router)

@app.get("/")
def root():
    return {"status": "running", "message": "BragBoard API is active"}
