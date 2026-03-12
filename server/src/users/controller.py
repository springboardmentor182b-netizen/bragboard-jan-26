from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlalchemy.orm import Session
from typing import List
import shutil
import os
from src.database.database import get_db
from src.entities import models, schemas
from src.auth.utils import get_current_user

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    from src.auth.utils import get_password_hash
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_user = models.User(
        email=user.email, 
        username=user.username, 
        full_name=user.full_name,
        dob=user.dob,
        work=user.work,
        company_name=user.company_name,
        phone_number=user.phone_number,
        job_title=user.job_title,
        department=user.department,
        password_hash=get_password_hash(user.password),
        role="employee"
    )
    db.add(new_user)
    db.flush() # Get user.id

    for q in user.security_questions:
        sq = models.SecurityQuestion(
            user_id=new_user.id,
            question=q.question,
            answer_hash=get_password_hash(q.answer)
        )
        db.add(sq)

    try:
        db.commit()
        db.refresh(new_user)
        return new_user
    except Exception as e:
        db.rollback()
        print(f"Error creating user: {e}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

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
