from fastapi import APIRouter

router = APIRouter(prefix="/admin/moderation", tags=["Moderation"])

@router.get("/reports")
async def get_reports():
    # This sends test data to your frontend
    return [
        {"id": 1, "shoutout_id": 101, "reason": "Spam", "message": "Example reported message 1"},
        {"id": 2, "shoutout_id": 102, "reason": "Inappropriate", "message": "Example reported message 2"}
    ]

@router.delete("/delete/{shoutout_id}")
async def delete_shoutout(shoutout_id: int):
    return {"message": f"Shoutout {shoutout_id} deleted successfully"}