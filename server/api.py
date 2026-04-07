from fastapi import FastAPI
from reports.controller import router as reports_router

def register_routes(app: FastAPI):
    app.include_router(reports_router)
