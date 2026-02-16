from fastapi import APIRouter

router = APIRouter()

@router.get('/stats')
def get_admin_stats():
    return {
        'users': 120,
        'shoutouts': 45,
        'reports': 3
    }
