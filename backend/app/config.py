import os
from functools import lru_cache

from dotenv import load_dotenv


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENV_PATH = os.path.join(BASE_DIR, ".env")

if os.path.exists(ENV_PATH):
    load_dotenv(ENV_PATH)


class Settings:
    """Application settings loaded from environment variables."""

    project_name: str = "Vidyamitra API"
    api_version: str = "1.0.0"

    frontend_origin: str = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")

    openai_api_key: str | None = os.getenv("OPENAI_API_KEY")
    google_api_key: str | None = os.getenv("GOOGLE_API_KEY")
    youtube_api_key: str | None = os.getenv("YOUTUBE_API_KEY")
    supabase_url: str | None = os.getenv("SUPABASE_URL")
    supabase_key: str | None = os.getenv("SUPABASE_KEY")
    pexels_api_key: str | None = os.getenv("PEXELS_API_KEY")
    news_api_key: str | None = os.getenv("NEWS_API_KEY")
    exchange_api_key: str | None = os.getenv("EXCHANGE_API_KEY")

    jwt_secret_key: str = os.getenv("JWT_SECRET_KEY", "change-this-secret")
    jwt_algorithm: str = "HS256"


@lru_cache
def get_settings() -> Settings:
    return Settings()

