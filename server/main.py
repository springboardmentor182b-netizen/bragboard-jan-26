from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.database.db import engine, Base
from src.reports.controller import router as reports_router

app = FastAPI()

# Create database tables

Base.metadata.create_all(bind=engine)

# Enable CORS for React frontend

app.add_middleware(
CORSMiddleware,
allow_origins=["*"],
allow_credentials=True,
allow_methods=["*"],
allow_headers=["*"],
)

# Register API routes

app.include_router(reports_router)
