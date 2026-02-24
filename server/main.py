from src.reports.models import Report
from src.entities.shoutout import Shoutout
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.database.db import engine, Base
from src.reports.controller import router as reports_router

app = FastAPI()

# Create tables
Base.metadata.create_all(bind=engine)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(reports_router)
from src.database.db import SessionLocal
from src.entities.shoutout import Shoutout

@app.get("/create-test-shoutouts")
def create_test_data():
    db = SessionLocal()

    shoutouts = [
        Shoutout(id=101, sender="Mike Chen", receiver="Sarah Johnson", message="Great work on the project!"),
        Shoutout(id=102, sender="John Doe", receiver="Emily Davis", message="Amazing presentation today!"),
        Shoutout(id=103, sender="Anna Lee", receiver="Chris Brown", message="Outstanding teamwork!")
    ]

    for s in shoutouts:
        db.add(s)

    db.commit()
    db.close()

    return {"message": "Test shoutouts created"}