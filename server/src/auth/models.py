from pydantic import BaseModel, EmailStr, Field

# ==================== REQUEST MODELS ====================

class UserRegister(BaseModel):
    """
    Data structure for registration requests(frontend to backend)
    """
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr  # Validates email format automatically
    password: str = Field(..., min_length=6, max_length=100)
    department: str = Field(..., min_length=2, max_length=100)
    security_question: str = Field(..., min_length=5, max_length=200)
    security_answer: str = Field(..., min_length=2, max_length=100)
    
    class Config:
        # Example for API documentation
        json_schema_extra = {
            "example": {
                "name": "Rahul Kumar",
                "email": "rahul@company.com",
                "password": "SecurePass123",
                "department": "Engineering",
                "security_question": "What is your first pet's name?",
                "security_answer": "Fluffy"
            }
        }

class UserLogin(BaseModel):
    """
    Data structure for login requests(frontend to backend)
    """
    email: EmailStr
    password: str
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "rahul@company.com",
                "password": "SecurePass123"
            }
        }

class ForgotPasswordRequest(BaseModel):
    email: EmailStr
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "rahul@company.com"
            }
        }

class VerifySecurityAnswerRequest(BaseModel):
    email: EmailStr
    security_answer: str
    new_password: str = Field(..., min_length=6, max_length=100)
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "rahul@company.com",
                "security_answer": "Fluffy",
                "new_password": "NewSecurePass123"
            }
        }

# ==================== RESPONSE MODELS ====================

class Token(BaseModel):
    """
    Response structure after successful login(backend to frontend)
    """
    access_token: str
    token_type: str
    user: dict
    
    class Config:
        json_schema_extra = {
            "example": {
                "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "token_type": "bearer",
                "user": {
                    "id": 1,
                    "name": "Rahul Kumar",
                    "email": "rahul@company.com",
                    "department": "Engineering",
                    "role": "employee"
                }
            }
        }