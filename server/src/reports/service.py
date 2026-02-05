from datetime import datetime

def get_all_reports():
    return [
        {
            "id": 1,
            "shoutout_id": 101,
            "reported_by": "jane@company.com",
            "reason": "Inappropriate language",
            "created_at": datetime.now()
        },
        {
            "id": 2,
            "shoutout_id": 102,
            "reported_by": "mike@company.com",
            "reason": "Spam or promotional content",
            "created_at": datetime.now()
        }
    ]

def resolve_report(report_id: int):
    return {
        "message": f"Report with ID {report_id} resolved successfully"
    }

def delete_shoutout(shoutout_id: int):
    return {
        "message": f"Shout-out with ID {shoutout_id} deleted successfully"
    }
