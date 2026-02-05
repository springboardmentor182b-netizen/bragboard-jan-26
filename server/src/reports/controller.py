from fastapi import APIRouter
from typing import List
from .models import ReportOut
from .service import (
    get_all_reports,
    resolve_report,
    delete_shoutout
)

router = APIRouter(
    prefix="/admin/reports",
    tags=["Admin Report Moderation"]
)

@router.get("/", response_model=List[ReportOut])
def fetch_reported_shoutouts():
    """
    Fetch all reported shout-outs for admin review
    """
    return get_all_reports()

@router.post("/{report_id}/resolve")
def resolve_report_by_id(report_id: int):
    """
    Resolve / ignore a reported shout-out
    """
    return resolve_report(report_id)

@router.delete("/shoutout/{shoutout_id}")
def delete_shoutout_by_id(shoutout_id: int):
    """
    Delete a reported shout-out
    """
    return delete_shoutout(shoutout_id)
