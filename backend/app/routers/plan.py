from typing import List

from fastapi import APIRouter
from pydantic import BaseModel


router = APIRouter()


class TrainingPlanRequest(BaseModel):
    target_role: str
    gaps: List[str]
    weeks_available: int


class PlanItem(BaseModel):
    week: int
    focus: str
    resources: List[str]


class TrainingPlanResponse(BaseModel):
    role: str
    duration_weeks: int
    plan: List[PlanItem]


@router.post("/", response_model=TrainingPlanResponse)
async def generate_training_plan(payload: TrainingPlanRequest) -> TrainingPlanResponse:
    """
    Generate a simple week-by-week plan stub.

    Later you can enrich it with GPT + YouTube / Google search integration.
    """
    plan: List[PlanItem] = []
    topics_cycle = payload.gaps or ["Foundations", "Projects", "Interview Prep"]
    for week in range(1, payload.weeks_available + 1):
        topic = topics_cycle[(week - 1) % len(topics_cycle)]
        plan.append(
            PlanItem(
                week=week,
                focus=f"Deep dive into {topic}",
                resources=[
                    f"Read top 3 tutorials on {topic}",
                    f"Build a mini-project applying {topic}",
                ],
            )
        )

    return TrainingPlanResponse(role=payload.target_role, duration_weeks=payload.weeks_available, plan=plan)

