from typing import List

from fastapi import APIRouter
from pydantic import BaseModel


router = APIRouter()


class InterviewStartRequest(BaseModel):
    target_role: str
    experience_years: float


class InterviewQuestion(BaseModel):
    id: int
    question: str
    hint: str | None = None


class InterviewAnswer(BaseModel):
    question_id: int
    answer: str


class InterviewFeedback(BaseModel):
    score: int
    strengths: List[str]
    improvements: List[str]


@router.post("/start", response_model=List[InterviewQuestion])
async def start_interview(payload: InterviewStartRequest) -> List[InterviewQuestion]:
    """Return a small set of mock interview questions."""
    return [
        InterviewQuestion(
            id=1,
            question=f"Tell me about a project where you used {payload.target_role} skills.",
            hint="Focus on impact, metrics, and your specific contribution.",
        ),
        InterviewQuestion(
            id=2,
            question="Describe a time you handled a difficult technical challenge.",
        ),
    ]


@router.post("/feedback", response_model=InterviewFeedback)
async def interview_feedback(answers: List[InterviewAnswer]) -> InterviewFeedback:
    """
    Stub endpoint for AI-driven feedback.

    This can later call GPT with the transcript to evaluate tone, structure, and clarity.
    """
    strengths = ["Clear structure", "Relevant examples"]
    improvements = ["Add more measurable outcomes", "Highlight your specific responsibilities"]
    return InterviewFeedback(score=8, strengths=strengths, improvements=improvements)

