from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from src.database.database import get_db
from src.entities import models, schemas
from src.auth.utils import (
    verify_password,
    create_access_token,
    get_current_user,
    get_password_hash
)

# ✅ SINGLE router (IMPORTANT)
router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)


# ----------------------------
# TEST ROUTE
# ----------------------------
@router.get("/test")
def test_auth():
    return {"message": "Auth module working"}


# ----------------------------
# GET CURRENT USER
# ----------------------------
@router.get("/me", response_model=schemas.User)
def get_me(current_user: models.User = Depends(get_current_user)):
    return current_user


# ----------------------------
# LOGIN
# ----------------------------
@router.post("/login", response_model=schemas.Token)
def login(login_data: schemas.LoginRequest, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(
        models.User.email == login_data.email
    ).first()

    if not db_user or not verify_password(login_data.password, db_user.password_hash):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    access_token = create_access_token(data={"sub": db_user.email})

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


# ----------------------------
# FORGOT PASSWORD
# ----------------------------
@router.post("/forgot-password")
def forgot_password(request: schemas.ForgotPasswordRequest, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(
        models.User.email == request.email
    ).first()

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    questions = [
        {"id": q.id, "question": q.question}
        for q in db_user.security_questions
    ]

    return {"questions": questions}


# ----------------------------
# VERIFY SECURITY QUESTION
# ----------------------------
@router.post("/verify-security-question")
def verify_security_question(request: schemas.SecurityQuestionVerify, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(
        models.User.email == request.email
    ).first()

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    question = db.query(models.SecurityQuestion).filter(
        models.SecurityQuestion.user_id == db_user.id,
        models.SecurityQuestion.question == request.question
    ).first()

    if not question or not verify_password(request.answer, question.answer_hash):
        raise HTTPException(status_code=400, detail="Incorrect answer")

    return {"message": "Verification successful"}


# ----------------------------
# RESET PASSWORD
# ----------------------------
@router.post("/reset-password")
def reset_password(request: schemas.ResetPasswordRequest, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(
        models.User.email == request.email
    ).first()

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    verified = False
    for q in db_user.security_questions:
        if verify_password(request.security_answer, q.answer_hash):
            verified = True
            break

    if not verified:
        raise HTTPException(status_code=400, detail="Security verification failed")

    db_user.password_hash = get_password_hash(request.new_password)
    db.commit()

    return {"message": "Password reset successfully"}
