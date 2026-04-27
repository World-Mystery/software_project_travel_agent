import os
from pathlib import Path

import pytest
from fastapi.testclient import TestClient


@pytest.fixture
def client(tmp_path: Path):
    os.environ["DATABASE_URL"] = f"sqlite:///{tmp_path / 'test.db'}"
    os.environ["SECRET_KEY"] = "test-secret"

    from app.core.config import get_settings
    from app.db import session as db_session
    from app.main import create_app

    get_settings.cache_clear()
    db_session._engine = None

    app = create_app()
    with TestClient(app) as test_client:
        yield test_client
