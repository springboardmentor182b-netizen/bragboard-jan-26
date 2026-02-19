from fastapi import APIRouter

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])

@router.get("/")
def get_analytics():
    return {
        "stats": [
            {"title": "Total Shoutouts", "value": "1,284"},
            {"title": "Active Comments", "value": "8,432"},
            {"title": "Engagement Rate", "value": "89%"}
        ],
        "top_employees": [
            {"rank": 1, "name": "Sarah Johnson", "count": "142 shoutouts"},
            {"rank": 2, "name": "Mike Chen", "count": "98 shoutouts"},
            {"rank": 3, "name": "Jessica Williams", "count": "87 shoutouts"},
        ],
        "top_categories": [
            {"rank": 1, "name": "Teamwork", "count": "450"},
            {"rank": 2, "name": "Innovation", "count": "320"},
            {"rank": 3, "name": "Leadership", "count": "210"},
        ]
    }
