from fastapi import FastAPI
from app.api.v1.admin.router import router as admin_router

app = FastAPI()

app.include_router(admin_router, prefix="/admin", tags=["admin"])
