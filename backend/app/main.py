from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import get_settings
from .routers import auth, resume, evaluate, plan, quiz, interview, jobs, progress


settings = get_settings()

app = FastAPI(
    title=settings.project_name,
    version=settings.api_version,
    description="AI-powered career assistant: resume evaluation, mock interviews, and career planning.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin, "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["health"])
async def health_check() -> dict:
    return {"status": "ok", "message": "Vidyamitra API is running"}


app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(resume.router, prefix="/resume", tags=["resume"])
app.include_router(evaluate.router, prefix="/evaluate", tags=["evaluation"])
app.include_router(plan.router, prefix="/plan", tags=["plan"])
app.include_router(quiz.router, prefix="/quiz", tags=["quiz"])
app.include_router(interview.router, prefix="/interview", tags=["interview"])
app.include_router(jobs.router, prefix="/jobs", tags=["jobs"])
app.include_router(progress.router, prefix="/progress", tags=["progress"])

