from pydantic import BaseModel

class CategoryResponse(BaseModel):
    value: str
    label: str
