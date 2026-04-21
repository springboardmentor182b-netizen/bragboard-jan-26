from pydantic import BaseModel, Field


class GenerateRepliesRequest(BaseModel):
    comment: str = Field(..., description="The comment to reply to")


class GenerateRepliesResponse(BaseModel):
    replies: list[str]

