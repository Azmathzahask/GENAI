from typing import List

from fastapi import APIRouter
from pydantic import BaseModel


router = APIRouter()


class JobRecommendationRequest(BaseModel):
    target_role: str
    location_preference: str | None = None


class JobRecommendation(BaseModel):
    title: str
    company: str
    location: str
    match_score: int


@router.post("/", response_model=List[JobRecommendation])
async def recommend_jobs(payload: JobRecommendationRequest) -> List[JobRecommendation]:
    """
    Simple job recommendation stub.

    Can later integrate with external job APIs.
    """
    location = payload.location_preference or "Remote"
    return [
        JobRecommendation(
            title=payload.target_role,
            company="Vidyamitra Labs",
            location=location,
            match_score=87,
        ),
        JobRecommendation(
            title=f"Junior {payload.target_role}",
            company="Future Careers Inc.",
            location=location,
            match_score=79,
        ),
    ]

