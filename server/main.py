import sys
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Force Python to recognize the current directory
sys.path.append(os.getcwd())

# 1. Database and Entity Imports
from src.database.core import engine, Base
from src.entities.user import User 

# 2. Router Imports
from src.auth.controller import router as auth_router

# 3. Create Database Tables
Base.metadata.create_all(bind=engine)

# 4. Initialize FastAPI App
app = FastAPI(title="BragBoard API")

# 5. Configure CORS
origins = ["http://localhost:3000", "http://localhost:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 6. Include Routes
app.include_router(auth_router)

@app.get("/")
def root():
    return {"message": "Welcome to BragBoard API - Database Tables Created!"}