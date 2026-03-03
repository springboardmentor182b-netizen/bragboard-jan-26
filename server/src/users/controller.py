from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlalchemy.orm import Session
from typing import List
import shutil
import os
from src.database.database import get_db
from src.entities import models, schemas

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    # fake_hashed_password = user.password + "notreallyhashed" # Not used in models.User as seen in code
    db_user = models.User(
        email=user.email, 
        username=user.username, 
        full_name=user.full_name, 
        role="employee" # default role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.get("/", response_model=List[schemas.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = db.query(models.User).offset(skip).limit(limit).all()
    return users

@router.get("/{user_id}", response_model=schemas.User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@router.put("/{user_id}", response_model=schemas.User)
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

@router.post("/{user_id}/image")
def upload_user_image(user_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    # Generate unique filename
    file_extension = file.filename.split(".")[-1]
    filename = f"user_{user_id}_profile.{file_extension}"
    file_location = f"static/{filename}"
    
    # Ensure static directory exists
    if not os.path.exists("static"):
        os.makedirs("static")
    
    with open(file_location, "wb+") as file_object:
        shutil.copyfileobj(file.file, file_object)
        
    # Update DB URL
    db_user.profile_picture = f"http://localhost:8000/static/{filename}"
    db.commit()
    
    return {"info": "Image uploaded successfully", "url": db_user.profile_picture}
