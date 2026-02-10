from typing import List

from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel

from ..ai import analyze_resume_with_ai


router = APIRouter()


class ResumeAnalysis(BaseModel):
    summary: str
    detected_skills: List[str]
    missing_skills: List[str]
    suggested_improvements: List[str]


@router.post("/parse", response_model=ResumeAnalysis)
async def parse_resume(file: UploadFile = File(...)) -> ResumeAnalysis:
    """
    Resume parser + AI analysis stub.

    In a full build you would:
    - Extract text from the uploaded PDF/DOCX
    - Call `analyze_resume_with_ai` with that text
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded")

    # In a real implementation, use something like pdfplumber/docx2txt.
    content_bytes = await file.read()
    text = content_bytes.decode(errors="ignore")
    ai_result = await analyze_resume_with_ai(text or "Empty resume content")

    return ResumeAnalysis(
        summary=ai_result["summary"],
        detected_skills=ai_result["detected_skills"],
        missing_skills=ai_result["missing_skills"],
        suggested_improvements=ai_result["suggested_improvements"],
    )

