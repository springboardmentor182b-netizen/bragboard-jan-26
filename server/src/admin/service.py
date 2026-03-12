from sqlalchemy.orm import Session
from sqlalchemy import func

from src.reports.models import Report
from src.entities.shoutout import Shoutout


# Get all reported shoutouts
def get_reports(db: Session):
    return db.query(Report).all()


# Delete shoutout (moderation)
def delete_shoutout(db: Session, shoutout_id: int):

    shoutout = db.query(Shoutout).filter(Shoutout.id == shoutout_id).first()

    if shoutout:
        db.delete(shoutout)
        db.commit()

    return {"message": "Shoutout deleted successfully"}


# Remove report after admin resolves it
def delete_report(db: Session, report_id: int):

    report = db.query(Report).filter(Report.id == report_id).first()

    if report:
        db.delete(report)
        db.commit()

    return {"message": "Report resolved and removed"}


# Top contributors (users who send most shoutouts)
def top_contributors(db: Session):

    return (
        db.query(Shoutout.sender, func.count(Shoutout.id).label("total"))
        .group_by(Shoutout.sender)
        .order_by(func.count(Shoutout.id).desc())
        .limit(5)
        .all()
    )


# Most tagged users
def most_tagged(db: Session):

    return (
        db.query(Shoutout.receiver, func.count(Shoutout.id).label("tags"))
        .group_by(Shoutout.receiver)
        .order_by(func.count(Shoutout.id).desc())
        .limit(5)
        .all()
    )
def get_leaderboard(db: Session):

    results = (
        db.query(
            Shoutout.receiver,
            func.count(Shoutout.id).label("total_shoutouts")
        )
        .group_by(Shoutout.receiver)
        .order_by(func.count(Shoutout.id).desc())
        .all()
    )

    leaderboard = []

    for r in results:
        leaderboard.append({
            "receiver": r.receiver,
            "total_shoutouts": r.total_shoutouts
        })

    return leaderboard
import csv
from io import StringIO
from fastapi.responses import StreamingResponse
from src.reports.models import Report


def export_reports_csv(db):

    reports = db.query(Report).all()

    output = StringIO()
    writer = csv.writer(output)

    # CSV header
    writer.writerow(["ID", "Shoutout ID", "Reported By", "Reason", "Created At"])

    # Data rows
    for r in reports:
        writer.writerow([
            r.id,
            r.shoutout_id,
            r.reported_by,
            r.reason,
            r.created_at
        ])

    output.seek(0)

    return StreamingResponse(
        output,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=reports.csv"}
    )

from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from io import BytesIO
from fastapi.responses import StreamingResponse
from src.reports.models import Report


def export_reports_pdf(db):

    reports = db.query(Report).all()

    buffer = BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=letter)

    y = 750
    pdf.setFont("Helvetica", 12)
    pdf.drawString(200, 800, "BragBoard Reports")

    for r in reports:
        line = f"ID: {r.id} | Shoutout: {r.shoutout_id} | By: {r.reported_by} | Reason: {r.reason}"
        pdf.drawString(50, y, line)
        y -= 20

        if y < 50:
            pdf.showPage()
            y = 750

    pdf.save()
    buffer.seek(0)

    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=reports.pdf"}
    )