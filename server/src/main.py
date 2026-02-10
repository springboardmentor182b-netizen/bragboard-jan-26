from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.database.core import engine, Base
from src.shoutouts import controller as shoutouts_controller
from src.entities import shoutout, user # Import to register tables

# Create Tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS (Frontend Connection)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register your Shoutouts Router
app.include_router(shoutouts_controller.router, prefix="/shoutouts", tags=["Shoutouts"])