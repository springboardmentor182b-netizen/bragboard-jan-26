from fastapi import APIRouter, HTTPException, status

from .gemini_service import generate_comment_replies
from .models import GenerateRepliesRequest, GenerateRepliesResponse


router = APIRouter(tags=["AI"])


@router.post(
    "/generate-replies",
    response_model=GenerateRepliesResponse,
    status_code=status.HTTP_200_OK,
)
@router.post(
    "/ai/comment-reply-suggestions",
    response_model=GenerateRepliesResponse,
    status_code=status.HTTP_200_OK,
)
def generate_replies(payload: GenerateRepliesRequest):
    comment = (payload.comment or "").strip()
    if not comment:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Comment must not be empty",
        )

    try:
        replies = generate_comment_replies(comment)
        return {"replies": replies}
    except RuntimeError as e:
        # Includes missing GEMINI_API_KEY or parsing/format issues.
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=str(e),
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Failed to generate replies from Gemini",
        )

