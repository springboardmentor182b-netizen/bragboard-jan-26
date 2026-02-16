from fastapi import FastAPI, Depends, HTTPException, status, File, UploadFile
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import shutil
import os

from src.database.database import engine, get_db, Base
from src.entities import models, schemas

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="BragBoard API")

# CORS setup
origins = [
    "http://localhost:3000",
    "http://localhost:5173", # Vite default
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create static directory if it doesn't exist
if not os.path.exists("static"):
    os.makedirs("static")

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
def read_root():
    return {"message": "Welcome to BragBoard API"}

# --- Users ---
@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    fake_hashed_password = user.password + "notreallyhashed"
    db_user = models.User(email=user.email, username=user.username, full_name=user.full_name, role="employee") # default role
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.get("/users/", response_model=List[schemas.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = db.query(models.User).offset(skip).limit(limit).all()
    return users

@app.get("/users/{user_id}", response_model=schemas.User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@app.put("/users/{user_id}", response_model=schemas.User)
def update_user(user_id: int, user_update: schemas.UserUpdate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user_update.full_name:
        db_user.full_name = user_update.full_name
    if user_update.job_title:
        db_user.job_title = user_update.job_title
    if user_update.department:
        db_user.department = user_update.department
        
    db.commit()
    db.refresh(db_user)
    return db_user

@app.post("/users/{user_id}/image")
def upload_user_image(user_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    # Generate unique filename
    file_extension = file.filename.split(".")[-1]
    filename = f"user_{user_id}_profile.{file_extension}"
    file_location = f"static/{filename}"
    
    with open(file_location, "wb+") as file_object:
        shutil.copyfileobj(file.file, file_object)
        
    # Update DB URL
    # In a real production app, this would be a full URL (e.g. S3 bucket)
    # Here we point to our static mount
    db_user.profile_picture = f"http://localhost:8000/static/{filename}"
    db.commit()
    
    return {"info": "Image uploaded successfully", "url": db_user.profile_picture}

# --- ShoutOuts ---
@app.post("/shoutouts/", response_model=schemas.ShoutOut)
def create_shoutout(shoutout: schemas.ShoutOutCreate, sender_id: int, db: Session = Depends(get_db)):
    # Mock authenticating sender for now, passing sender_id via query param or similar in real app would be JWT
    db_sender = db.query(models.User).filter(models.User.id == sender_id).first()
    if not db_sender:
         raise HTTPException(status_code=404, detail="Sender not found")
         
    db_shoutout = models.ShoutOut(
        content=shoutout.content,
        sender_id=sender_id,
        recipient_id=shoutout.recipient_id,
        tags=shoutout.tags,
        reactions={},
        comments=[]
    )
    db.add(db_shoutout)
    db.commit()
    db.refresh(db_shoutout)
    return db_shoutout

@app.get("/shoutouts/", response_model=List[schemas.ShoutOut])
def read_shoutouts(skip: int = 0, limit: int = 100, sender_id: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(models.ShoutOut)
    if sender_id:
        query = query.filter(models.ShoutOut.sender_id == sender_id)
    shoutouts = query.order_by(models.ShoutOut.created_at.desc()).offset(skip).limit(limit).all()
    return shoutouts

# --- Comments ---
@app.post("/comments/", response_model=schemas.Comment)
def create_comment(comment: schemas.CommentCreate, user_id: int, db: Session = Depends(get_db)):
    # Mock user auth
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
        
    db_shoutout = db.query(models.ShoutOut).filter(models.ShoutOut.id == comment.shoutout_id).first()
    if not db_shoutout:
        raise HTTPException(status_code=404, detail="ShoutOut not found")

    db_comment = models.Comment(
        content=comment.content,
        user_id=user_id,
        shoutout_id=comment.shoutout_id
    )
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment

# --- Reports ---
@app.post("/reports/", response_model=schemas.Report)
def create_report(report: schemas.ReportCreate, user_id: int, db: Session = Depends(get_db)):
    # Mock user auth
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
        
    db_shoutout = db.query(models.ShoutOut).filter(models.ShoutOut.id == report.shoutout_id).first()
    if not db_shoutout:
        raise HTTPException(status_code=404, detail="ShoutOut not found")

    db_report = models.Report(
        reason=report.reason,
        details=report.details,
        user_id=user_id,
        shoutout_id=report.shoutout_id
    )
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    return db_report
