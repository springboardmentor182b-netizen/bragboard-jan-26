from fastapi import FastAPI
from app.routes import auth
from app.db.base import Base  # ensures tables created

app = FastAPI(title="BragBoard API - Authentication")

app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
