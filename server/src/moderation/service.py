def fetch_all_reports(db):
    # This is a placeholder for your actual DB query logic
    # It joins the Reports table with Shoutouts to get the text
    return db.execute("SELECT * FROM reports").fetchall()

def delete_shoutout_record(db, shoutout_id: int):
    # Logic to delete the shoutout from the DB
    return {"status": "success", "message": f"Shoutout {shoutout_id} deleted"}