import os
import sys
from pathlib import Path
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

# Fix the path so Python sees the 'src' folder
current_dir = Path(__file__).resolve().parent
if str(current_dir) not in sys.path:
    sys.path.insert(0, str(current_dir))

# 1. IMPORT DATABASE CORE
from src.database.core import engine, Base, get_db

# 2. IMPORT BOTH ENTITIES (Crucial for the relationship to work)
from src.entities.shoutout import Shoutout 
from src.entities.report import Report 

# 3. CREATE TABLES
# This will now create both 'shoutouts' and 'reports' tables in bragboard.db
Base.metadata.create_all(bind=engine)

app = FastAPI(title="BragBoard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/shoutouts/")
async def get_shoutouts(db: Session = Depends(get_db)):
    # This pulls all shoutouts from the database
    shoutouts = db.query(Shoutout).all()
    return {"shoutouts": shoutouts}

@app.post("/shoutouts/")
async def create_shoutout(data: dict, db: Session = Depends(get_db)):
    # Maps 'message' from frontend to 'content' in backend
    new_shoutout = Shoutout(
        sender=data.get("sender"),
        receiver=data.get("receiver"),
        content=data.get("message") 
    )
    db.add(new_shoutout)
    db.commit()
    db.refresh(new_shoutout)
    return {"message": "Shoutout added successfully", "id": new_shoutout.id}

# 4. OPTIONAL: ADD REPORT ROUTE (Since you built the entity!)
@app.post("/reports/")
async def create_report(data: dict, db: Session = Depends(get_db)):
    new_report = Report(
        shoutout_id=data.get("shoutout_id"),
        reason=data.get("reason"),
        details=data.get("details")
    )
    db.add(new_report)
    db.commit()
    return {"message": "Report submitted"}