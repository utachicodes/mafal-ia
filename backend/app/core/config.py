from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional


class Settings(BaseSettings):
    DATABASE_URL: str = "file:../prisma/dev.db"
    ANTHROPIC_API_KEY: Optional[str] = ""
    API_SECRET_KEY: str = "mafal-default-secret"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()
