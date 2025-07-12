from pydantic import BaseSettings

class Settings(BaseSettings):
    mistral_api_key: str = "emC4rQjGSaHDhpdW2I1FqLekq6M0VaUW"
    database_url: str = "postgresql+asyncpg://user:pass@localhost/edusync"
    redis_url: str = "redis://localhost:6379"
    enable_mars_latency: bool = True
    log_level: str = "INFO"

settings = Settings()