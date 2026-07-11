from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

_ENV_FILE = Path(__file__).resolve().parent.parent.parent / ".env"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=_ENV_FILE, extra="ignore")

    openai_api_key: str
    openai_model: str = "gpt-4o-mini"


@lru_cache
def get_settings() -> Settings:
    return Settings() # type: ignore
