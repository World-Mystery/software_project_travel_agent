from pathlib import Path

from sqlmodel import Session, SQLModel, create_engine

from app.core.config import get_settings

_engine = None


def get_engine():
    global _engine
    if _engine is None:
        settings = get_settings()
        if settings.database_url.startswith("sqlite:///./"):
            relative_path = settings.database_url.removeprefix("sqlite:///./")
            Path(relative_path).parent.mkdir(parents=True, exist_ok=True)
        connect_args = {"check_same_thread": False} if settings.database_url.startswith("sqlite") else {}
        _engine = create_engine(settings.database_url, echo=False, connect_args=connect_args)
    return _engine


def create_db_and_tables() -> None:
    SQLModel.metadata.create_all(get_engine())


def get_session() -> Session:
    return Session(get_engine())
