from fastapi import APIRouter

router = APIRouter(prefix="/api/users", tags=["Users"])

@router.get("/")
def get_users():
    return [
        {"id": 1, "name": "Sarah Johnson", "email": "sarah@company.com", "dept": "Marketing", "role": "employee"},
        {"id": 2, "name": "Mike Chen", "email": "mike@company.com", "dept": "Engineering", "role": "admin"},
        {"id": 3, "name": "Alex Rossi", "email": "alex@company.com", "dept": "Sales", "role": "employee"},
    ]
