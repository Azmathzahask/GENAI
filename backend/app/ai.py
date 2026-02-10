"""
Central place to integrate external AI + content APIs.

Right now this file exposes stub functions that you can later
extend to call:
- OpenAI (GPT-4 / GPT-4.1) for resume analysis & interview feedback
- YouTube / Google APIs for learning resources
- Supabase for persistent storage
"""

from typing import Any, Dict, List

from .config import get_settings


settings = get_settings()


async def analyze_resume_with_ai(text: str) -> Dict[str, Any]:
    """
    Hook for GPT-powered resume analysis.

    Extend this to:
    - call OpenAI with `settings.openai_api_key`
    - craft a system prompt around career guidance
    - parse the model response into a structured dict
    """
    # Stub response for now
    return {
        "summary": "AI analysis placeholder. Connect OpenAI to enable deep resume feedback.",
        "detected_skills": ["Python", "React", "SQL"],
        "missing_skills": ["Data Visualization", "Cloud Fundamentals"],
        "suggested_improvements": [
            "Quantify your achievements with metrics.",
            "Showcase cloud or DevOps exposure if available.",
        ],
    }


async def generate_interview_feedback(transcript: str) -> Dict[str, Any]:
    """
    Hook for GPT-powered mock interview feedback.
    """
    return {
        "score": 8,
        "strengths": ["Clear narrative", "Relevant examples"],
        "improvements": ["Add more measurable outcomes", "Highlight team collaboration explicitly"],
    }


async def fetch_learning_resources(keywords: List[str]) -> List[Dict[str, Any]]:
    """
    Hook for Google / YouTube API integration.
    """
    return [
        {
            "title": f"Top {keywords[0]} crash course",
            "source": "YouTube",
            "url": "https://example.com/demo-video",
        }
    ]

