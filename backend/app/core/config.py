from pydantic_settings import BaseSettings, SettingsConfigDict

#BaseSettings can read .env file and Settings inherits it
class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

#usign settings in any file we can access the .env keys
settings = Settings()   # pyright: ignore[reportCallIssue]