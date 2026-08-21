from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    VERSION: str = "0.5.0"
    ENVIRONMENT: str = "production"
    LOG_LEVEL: str = "INFO"

    # Server Settings
    BACKEND_HOST: str = "0.0.0.0"
    BACKEND_PORT: int = 8000
    PORT: int | None = None
    ALLOWED_CORS_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,http://localhost:80,http://localhost,https://civicpulse-ai-frontend.onrender.com"

    # Security
    SECRET_KEY: str = "dev-secret-key-change-in-production-civicpulse-ai-2026"
    MAX_BODY_SIZE_BYTES: int = 10 * 1024 * 1024  # 10 MB

    # AI Configuration
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL_NAME: str = "gemini-2.5-flash"

    # Database
    DATABASE_URL: str = "postgresql://civicpulse:civicpulse_secret@localhost:5432/civicpulse_db"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @property
    def effective_port(self) -> int:
        return self.PORT if self.PORT is not None else self.BACKEND_PORT

    @property
    def cors_origins_list(self) -> list[str]:
        raw_origins = [origin.strip().rstrip("/") for origin in self.ALLOWED_CORS_ORIGINS.split(",") if origin.strip()]
        seen = set()
        result = []
        for o in raw_origins:
            if o not in seen:
                seen.add(o)
                result.append(o)
        return result


settings = Settings()
