from pydantic import BaseSettings

class Settings(BaseSettings):
    mistral_api_key: str = "emC4rQjGSaHDhpdW2I1FqLekq6M0VaUW"
    database_url: str = "postgresql+asyncpg://user:pass@localhost/edusync"
    redis_url: str = "redis://localhost:6379"
    enable_mars_latency: bool = True
    log_level: str = "INFO"

    # JWT Authentication settings
    jwt_secret_key: str = "your-secret-key-change-in-production"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    refresh_token_expire_days: int = 7

    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()