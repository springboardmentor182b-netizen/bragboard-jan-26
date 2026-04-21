from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

from src.database.config import engine, Base
from src.entities import user, shoutout, shoutout_recipient, report, admin_log
from src.shoutouts.controller import router as shoutouts_router
from src.reports.controller import router as reports_router

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="BragBoard API - Shoutout Module",
    description="Employee Recognition Platform - Shoutout Management",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS - Allow all for testing
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API routes - only shoutout endpoints
API_PREFIX = "/api/v1"
app.include_router(shoutouts_router, prefix=f"{API_PREFIX}/shoutouts", tags=["Shoutouts"])
app.include_router(reports_router, prefix=f"{API_PREFIX}/reports", tags=["Reports"])

@app.get("/")
def root():
    return {"message": "BragBoard API - Shoutout Module", "version": "2.0.0"}

@app.get("/health")
def health():
    return {"status": "healthy"}
