from fastapi import APIRouter

router = APIRouter(prefix="/api/logs", tags=["Logs"])

@router.get("/")
def get_logs():
    return [
        {"id": 1, "title": "User Login", "badge": "Info", "time": "10:42 AM", "desc": "Admin User logged in.", "user": "admin@company.com"},
        {"id": 2, "title": "Failed Login", "badge": "Warning", "time": "10:30 AM", "desc": "Failed attempts detected.", "user": "unknown"},
        {"id": 3, "title": "Profile Updated", "badge": "Success", "time": "09:15 AM", "desc": "Sarah updated her profile.", "user": "sarah@company.com"}
    ]
