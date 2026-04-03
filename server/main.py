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

# 1. DATABASE & ENTITY IMPORTS
from src.database.core import engine, Base, get_db
from src.entities.shoutout import Shoutout 
from src.entities.report import Report 
from src.entities.user import User  # Ensure this is here for table creation

# 2. ADMIN ROUTER IMPORT
try:
    from app.api.v1.admin.router import router as admin_router
except ImportError:
    # This handles path issues if running from different directories
    from api.v1.admin.router import router as admin_router

# 3. CREATE TABLES (Crucial: Do this before starting the App)
Base.metadata.create_all(bind=engine)

# 4. INITIALIZE APP (Only once!)
app = FastAPI(title="BragBoard API")

# 5. CONFIGURE CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 6. INCLUDE THE ADMIN ROUTER
app.include_router(admin_router, prefix="/admin", tags=["Admin"])

# --- EXISTING SHOUTOUT ROUTES ---

@app.get("/shoutouts/")
async def get_shoutouts(db: Session = Depends(get_db)):
    shoutouts = db.query(Shoutout).all()
    return {"shoutouts": shoutouts}

@app.post("/shoutouts/")
async def create_shoutout(data: dict, db: Session = Depends(get_db)):
    new_shoutout = Shoutout(
        sender=data.get("sender"),
        receiver=data.get("receiver"),
        content=data.get("message") 
    )
    db.add(new_shoutout)
    db.commit()
    db.refresh(new_shoutout)
    return {"message": "Shoutout added successfully", "id": new_shoutout.id}

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