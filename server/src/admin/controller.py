from fastapi import APIRouter, Depends, Response
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
import csv
import io
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

from src.database.database import get_db
from src.entities.models import User, Shoutout, Report, Comment

router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)


from src.reports import service as reports_service

# ----------------------------
# REPORT MODERATION
# ----------------------------

@router.get("/reports")
def get_reports(db: Session = Depends(get_db)):
    return reports_service.get_all_reports(db)


@router.post("/reports/{report_id}/resolve")
def resolve_report(report_id: int, db: Session = Depends(get_db)):
    return reports_service.resolve_report(db, report_id)


@router.delete("/reports/shoutout/{shoutout_id}")
def delete_shoutout(shoutout_id: int, db: Session = Depends(get_db)):
    return reports_service.delete_shoutout(db, shoutout_id)


# ----------------------------
# ACCOUNT MANAGEMENT
# ----------------------------

@router.get("/users")
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()


@router.get("/users/count")
def get_total_users(db: Session = Depends(get_db)):
    return {
        "total_users": db.query(User).count()
    }


@router.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):

    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if user:
        db.delete(user)
        db.commit()

    return {"message": "User deleted"}


@router.get("/users/export/csv")
def export_users_csv(db: Session = Depends(get_db)):
    users = db.query(User).all()
    
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Username", "Email", "Full Name", "Department", "Job Title", "Role"])
    
    for user in users:
        writer.writerow([
            user.id,
            user.username,
            user.email,
            user.full_name,
            user.department,
            user.job_title,
            user.role
        ])
    
    output.seek(0)
    return StreamingResponse(
        io.BytesIO(output.getvalue().encode()),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=users.csv"}
    )


@router.get("/users/export/pdf")
def export_users_pdf(db: Session = Depends(get_db)):
    users = db.query(User).all()
    
    buffer = io.BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter
    
    # Title
    p.setFont("Helvetica-Bold", 16)
    p.drawString(100, height - 50, "BragBoard User List")
    p.setFont("Helvetica", 10)
    p.drawString(100, height - 70, f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Table Header
    p.setFont("Helvetica-Bold", 12)
    p.drawString(50, height - 100, "ID")
    p.drawString(100, height - 100, "Full Name")
    p.drawString(250, height - 100, "Email")
    p.drawString(450, height - 100, "Department")
    
    p.line(50, height - 110, 550, height - 110)
    
    # User Rows
    y = height - 130
    p.setFont("Helvetica", 10)
    for user in users:
        if y < 50: # New page if needed
            p.showPage()
            y = height - 50
            p.setFont("Helvetica", 10)
            
        p.drawString(50, y, str(user.id))
        p.drawString(100, y, str(user.full_name or "N/A"))
        p.drawString(250, y, str(user.email))
        p.drawString(450, y, str(user.department or "N/A"))
        y -= 20
        
    p.save()
    buffer.seek(0)
    return Response(
        content=buffer.getvalue(),
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=users.pdf"}
    )

from datetime import datetime, timedelta
from sqlalchemy import func

# ----------------------------
# ANALYTICS
# ----------------------------

@router.get("/analytics") 
def get_analytics(db: Session = Depends(get_db)):
    # 1. OVERVIEW STATS
    total_users = db.query(User).count()
    total_shoutouts = db.query(Shoutout).count()
    total_comments = db.query(Comment).count()
    total_reports = db.query(Report).count()
    
    # Calculate total reactions
    all_shoutouts = db.query(Shoutout).all()
    total_reactions = 0
    for s in all_shoutouts:
        if s.reactions:
            total_reactions += sum(s.reactions.values())
            
    # Active users (users who sent, received, or commented)
    sent_ids = db.query(Shoutout.sender_id).distinct()
    rcvd_ids = db.query(Shoutout.recipient_id).distinct()
    cmnt_ids = db.query(Comment.user_id).distinct()
    active_user_ids = set([r[0] for r in sent_ids] + [r[0] for r in rcvd_ids] + [r[0] for r in cmnt_ids])
    active_users = len(active_user_ids)
    
    avg_per_user = round(total_shoutouts / total_users, 1) if total_users > 0 else 0

    # 2. DEPARTMENT PERFORMANCE
    departments = db.query(User.department).distinct().all()
    dept_performance = []
    for (dept_name,) in departments:
        if not dept_name: continue
        dept_users = db.query(User).filter(User.department == dept_name).all()
        team_size = len(dept_users)
        dept_user_ids = [u.id for u in dept_users]
        
        dept_shoutouts = db.query(Shoutout).filter(Shoutout.sender_id.in_(dept_user_ids)).count()
        engaged_count = db.query(Shoutout.sender_id).filter(Shoutout.sender_id.in_(dept_user_ids)).distinct().count()
        
        dept_performance.append({
            "name": dept_name,
            "team_size": team_size,
            "shoutouts": dept_shoutouts,
            "avg_per_user": round(dept_shoutouts / team_size, 1) if team_size > 0 else 0,
            "engagement_pct": round((engaged_count / team_size) * 100) if team_size > 0 else 0
        })

    # 3. TOP CONTRIBUTORS
    # Calculate sent + received for each user
    top_contributors = []
    users = db.query(User).all()
    for user in users:
        sent = db.query(Shoutout).filter(Shoutout.sender_id == user.id).count()
        received = db.query(Shoutout).filter(Shoutout.recipient_id == user.id).count()
        if sent > 0 or received > 0:
            top_contributors.append({
                "name": user.full_name,
                "department": user.department,
                "sent": sent,
                "received": received,
                "profile_picture": user.profile_picture,
                "initial": user.full_name[0] if user.full_name else "U",
                "total": sent + received
            })
    top_contributors.sort(key=lambda x: x["total"], reverse=True)
    top_contributors = top_contributors[:5]

    # 4. RECENT ACTIVITY (Last 7 Days)
    recent_activity = []
    today = datetime.utcnow().date()
    for i in range(7):
        day = today - timedelta(days=i)
        day_start = datetime.combine(day, datetime.min.time())
        day_end = datetime.combine(day, datetime.max.time())
        
        day_shoutouts = db.query(Shoutout).filter(Shoutout.created_at >= day_start, Shoutout.created_at <= day_end).count()
        day_comments = db.query(Comment).filter(Comment.created_at >= day_start, Comment.created_at <= day_end).count()
        
        # Reactions for that day
        day_s_with_reactions = db.query(Shoutout).filter(Shoutout.created_at >= day_start, Shoutout.created_at <= day_end).all()
        day_reactions = sum([sum(s.reactions.values()) for s in day_s_with_reactions if s.reactions])
        
        day_label = "Today" if i == 0 else "Yesterday" if i == 1 else f"{i} days ago"
        
        recent_activity.append({
            "day": day_label,
            "shoutouts": day_shoutouts,
            "reactions": day_reactions,
            "comments": day_comments
        })

    return {
        "overview": {
            "total_users": total_users,
            "active_users": active_users,
            "total_shoutouts": total_shoutouts,
            "total_reactions": total_reactions,
            "total_comments": total_comments,
            "avg_per_user": avg_per_user
        },
        "department_performance": dept_performance,
        "top_contributors": top_contributors,
        "recent_activity": recent_activity
    }