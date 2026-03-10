from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class UserBase(BaseModel):
    username: str
    email: str
    full_name: str
    job_title: Optional[str] = "Team Member"
    department: Optional[str] = "General"
    profile_picture: Optional[str] = None
    dob: Optional[str] = None
    work: Optional[str] = None
    company_name: Optional[str] = None
    phone_number: Optional[str] = None

class SecurityQuestionBase(BaseModel):
    question: str

class SecurityQuestionCreate(SecurityQuestionBase):
    answer: str

class SecurityQuestion(SecurityQuestionBase):
    id: int
    user_id: int

    class Config:
        orm_mode = True

class UserCreate(UserBase):
    password: str
    job_title: Optional[str] = "Team Member"
    department: Optional[str] = "General"
    security_questions: List[SecurityQuestionCreate]

class LoginRequest(BaseModel):
    email: str
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    job_title: Optional[str] = None
    department: Optional[str] = None

class User(UserBase):
    id: int
    role: str

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class ForgotPasswordRequest(BaseModel):
    email: str

class SecurityQuestionVerify(BaseModel):
    email: str
    question: str
    answer: str

class ResetPasswordRequest(BaseModel):
    email: str
    security_answer: str
    new_password: str

class ShoutOutBase(BaseModel):
    content: str
    recipient_id: int
    tags: List[str] = []

class ShoutOutCreate(ShoutOutBase):
    pass

class ShoutOut(ShoutOutBase):
    id: int
    sender_id: int
    created_at: datetime
    reactions: Dict[str, int]
class CommentBase(BaseModel):
    content: str

class CommentCreate(CommentBase):
    shoutout_id: int

class Comment(CommentBase):
    id: int
    user_id: int
    shoutout_id: int
    created_at: datetime
    user: Optional[UserBase]

    class Config:
        orm_mode = True

class ReportBase(BaseModel):
    reason: str
    details: Optional[str] = None
    shoutout_id: int

class ReportCreate(ReportBase):
    pass

class Report(ReportBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        orm_mode = True

class ShoutOut(ShoutOutBase):
    id: int
    sender_id: int
    created_at: datetime
    reactions: Dict[str, int]
    comments: List[Comment] = []
    
    sender: User
    recipient: User

    class Config:
        orm_mode = True
