from fastapi import APIRouter
from typing import List
from .models import UserItem, LogItem, AnalyticsData

router = APIRouter()

# --- 1. Analytics Endpoint ---
@router.get("/analytics", response_model=AnalyticsData)
def get_analytics():
    return {
        "stats": [
            {"title": "Total Likes", "value": "70", "trend": "up"},
            {"title": "Total Comments", "value": "5", "trend": "neutral"},
            {"title": "Avg Likes/Post", "value": "17.5", "trend": "up"}
        ],
        "top_employees": [
            {"rank": 1, "name": "Mike Chen", "count": "1 shoutouts"},
            {"rank": 2, "name": "Emily Rodriguez", "count": "1 shoutouts"},
            {"rank": 3, "name": "James Wilson", "count": "1 shoutouts"},
            {"rank": 4, "name": "Rachel Brown", "count": "1 shoutouts"},
            {"rank": 5, "name": "Jessica Lee", "count": "1 shoutouts"},
        ],
        "top_categories": [
            {"rank": 1, "name": "Teamwork", "count": "2 mentions"},
            {"rank": 2, "name": "Leadership", "count": "2 mentions"},
            {"rank": 3, "name": "Problem Solving", "count": "1 mentions"},
            {"rank": 4, "name": "Customer Service", "count": "1 mentions"},
            {"rank": 5, "name": "Innovation", "count": "1 mentions"},
            {"rank": 6, "name": "Creativity", "count": "1 mentions"},
            {"rank": 7, "name": "Mentorship", "count": "1 mentions"},
        ]
    }

# --- 2. Users Endpoint ---
@router.get("/users", response_model=List[UserItem])
def get_users():
    return [
        {"id": 1, "name": "Sarah Johnson", "email": "sarah.johnson@company.com", "dept": "Engineering", "role": "employee", "status": "active", "joined": "2024-01-15", "initial": "SJ", "color": "bg-blue-600"},
        {"id": 2, "name": "Mike Chen", "email": "mike.chen@company.com", "dept": "Engineering", "role": "employee", "status": "active", "joined": "2024-02-01", "initial": "MC", "color": "bg-indigo-600"},
        {"id": 3, "name": "Emily Rodriguez", "email": "emily.rodriguez@company.com", "dept": "Sales", "role": "employee", "status": "active", "joined": "2024-01-20", "initial": "ER", "color": "bg-purple-600"},
        {"id": 4, "name": "James Wilson", "email": "james.wilson@company.com", "dept": "Marketing", "role": "employee", "status": "active", "joined": "2024-03-10", "initial": "JW", "color": "bg-pink-600"},
        {"id": 5, "name": "Lisa Anderson", "email": "lisa.anderson@company.com", "dept": "HR", "role": "admin", "status": "active", "joined": "2023-11-05", "initial": "LA", "color": "bg-teal-600"},
        {"id": 6, "name": "Admin User", "email": "admin@company.com", "dept": "Management", "role": "admin", "status": "active", "joined": "2023-10-01", "initial": "AU", "color": "bg-gray-900"},
    ]

# --- 3. Logs Endpoint ---
@router.get("/logs", response_model=List[LogItem])
def get_logs():
    return [
        {"id": 1, "type": "success", "title": "User Login", "badge": "Success", "desc": "Successful login from web interface", "user": "Sarah Johnson", "ip": "192.168.1.45", "time": "2025-01-29 14:23:15"},
        {"id": 2, "type": "info", "title": "Shoutout Created", "badge": "Info", "desc": "Created a shoutout for Emily Rodriguez", "user": "Mike Chen", "ip": "192.168.1.67", "time": "2025-01-29 14:20:42"},
        {"id": 3, "type": "warning", "title": "Failed Login Attempt", "badge": "Warning", "desc": "Invalid credentials for user 'admin'", "user": "Unknown", "ip": "203.45.12.98", "time": "2025-01-29 14:18:33"},
        {"id": 4, "type": "success", "title": "User Updated", "badge": "Success", "desc": "Updated user profile for James Wilson", "user": "Admin User", "ip": "192.168.1.10", "time": "2025-01-29 14:15:20"},
        {"id": 5, "type": "info", "title": "Comment Added", "badge": "Info", "desc": "Added a new comment on post #402", "user": "Mike Chen", "ip": "192.168.1.67", "time": "2025-01-29 14:12:08"},
    ]