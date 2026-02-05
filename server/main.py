from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="BragBoard Backend")

# =========================
# CORS CONFIGURATION
# =========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# DUMMY REPORT DATA
# =========================
reports = [
    {
        "id": 1,
        "shoutout_id": 101,
        "reported_by": "jane@company.com",
        "reason": "Inappropriate language",
        "created_at": "2026-02-05T07:37:48.991483",
    },
    {
        "id": 2,
        "shoutout_id": 102,
        "reported_by": "mike@company.com",
        "reason": "Spam or promotional content",
        "created_at": "2026-02-05T07:37:48.992482",
    },
    {
        "id": 3,
        "shoutout_id": 103,
        "reported_by": "alex@company.com",
        "reason": "Harassment",
        "created_at": "2026-02-05T08:10:12.123456",
    },
    {
        "id": 4,
        "shoutout_id": 104,
        "reported_by": "sara@company.com",
        "reason": "Offensive content",
        "created_at": "2026-02-05T08:15:55.654321",
    },
    {
        "id": 5,
        "shoutout_id": 105,
        "reported_by": "rohan@company.com",
        "reason": "Fake appreciation message",
        "created_at": "2026-02-05T08:22:01.789012",
    },
]

# =========================
# ROUTES
# =========================

@app.get("/")
def root():
    return {"message": "BragBoard backend running successfully"}

# 🔹 Fetch all reported shoutouts
@app.get("/admin/reports")
def get_reports():
    return reports

# 🔹 Resolve a report by report_id
@app.post("/admin/reports/{report_id}/resolve")
def resolve_report(report_id: int):
    global reports
    reports = [r for r in reports if r["id"] != report_id]
    return {"message": "Report resolved successfully"}

# 🔹 Delete shoutout by shoutout_id
@app.delete("/admin/reports/shoutout/{shoutout_id}")
def delete_shoutout(shoutout_id: int):
    global reports
    reports = [r for r in reports if r["shoutout_id"] != shoutout_id]
    return {"message": "Shoutout deleted successfully"}
