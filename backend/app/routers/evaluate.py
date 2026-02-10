from typing import List

from fastapi import APIRouter
from pydantic import BaseModel


router = APIRouter()


class SkillEvaluationRequest(BaseModel):
    target_role: str
    current_skills: List[str]
    experience_years: float


class SkillGap(BaseModel):
    skill: str
    level: str
    priority: str


class SkillEvaluationResponse(BaseModel):
    role: str
    strengths: List[str]
    gaps: List[SkillGap]
    summary: str


@router.post("/", response_model=SkillEvaluationResponse)
async def evaluate_skills(payload: SkillEvaluationRequest) -> SkillEvaluationResponse:
    """
    Simple rule-based evaluator stub.

    This can later be extended to call GPT for deeper reasoning.
    """
    strengths = [s for s in payload.current_skills if s.lower() in {"python", "react", "sql"}]
    gaps = [
        SkillGap(skill="Data Visualization", level="beginner", priority="high"),
        SkillGap(skill="Cloud Fundamentals", level="beginner", priority="medium"),
    ]

    return SkillEvaluationResponse(
        role=payload.target_role,
        strengths=strengths,
        gaps=gaps,
        summary=(
            f"For the role {payload.target_role}, you have strong foundations in {', '.join(strengths) or 'general programming'} "
            "but should focus on visualization and cloud concepts to be more market-ready."
        ),
    )

