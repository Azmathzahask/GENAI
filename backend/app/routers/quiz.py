from typing import List

from fastapi import APIRouter
from pydantic import BaseModel


router = APIRouter()


class QuizQuestion(BaseModel):
    id: int
    question: str
    options: List[str]
    correct_index: int


class QuizRequest(BaseModel):
    domain: str
    difficulty: str = "medium"
    num_questions: int = 5


class QuizSubmission(BaseModel):
    answers: List[int]


class QuizResult(BaseModel):
    score: int
    total: int
    feedback: str


@router.post("/generate", response_model=List[QuizQuestion])
async def generate_quiz(payload: QuizRequest) -> List[QuizQuestion]:
    """Return a small, static quiz for now."""
    base_questions = [
        QuizQuestion(
            id=1,
            question=f"Which data structure is best for LRU cache in {payload.domain}?",
            options=["Queue", "Stack", "LinkedHashMap / OrderedDict", "Array"],
            correct_index=2,
        ),
        QuizQuestion(
            id=2,
            question="What does Big-O notation describe?",
            options=["Exact runtime", "Average memory usage", "Asymptotic performance", "Compiler speed"],
            correct_index=2,
        ),
    ]
    return base_questions[: payload.num_questions]


@router.post("/submit", response_model=QuizResult)
async def submit_quiz(submission: QuizSubmission) -> QuizResult:
    """Very simple scoring based on hard-coded correct answers."""
    correct_answers = [2, 2]
    total = min(len(correct_answers), len(submission.answers))
    score = sum(int(a == correct_answers[i]) for i, a in enumerate(submission.answers[:total]))

    feedback = "Great work!" if score == total else "Review the explanations and try again."
    return QuizResult(score=score, total=total, feedback=feedback)

