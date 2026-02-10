from typing import List

from fastapi import APIRouter
from pydantic import BaseModel


router = APIRouter()


class ProgressItem(BaseModel):
    module: str
    completed: int
    total: int


class ProgressResponse(BaseModel):
    items: List[ProgressItem]


@router.get("/", response_model=ProgressResponse)
async def get_progress() -> ProgressResponse:
    """
    Return demo progress data.

    In production, this would read from Supabase or another database.
    """
    return ProgressResponse(
        items=[
            ProgressItem(module="Resume Evaluation", completed=1, total=1),
            ProgressItem(module="Skill Mapping", completed=2, total=5),
            ProgressItem(module="Training Planner", completed=1, total=3),
            ProgressItem(module="Quizzes", completed=3, total=10),
            ProgressItem(module="Mock Interviews", completed=1, total=4),
        ]
    )

