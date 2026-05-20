from datetime import date
from typing import Any

from app.agents.state import PlanningState
from app.services.providers import get_weather_provider


def run_weather_agent(state: PlanningState) -> dict[str, Any]:
    provider = get_weather_provider()
    try:
        weather = provider.forecast(
            _parse_date(state.request["start_date"]),
            _parse_date(state.request["end_date"]),
            state.request["city"],
        )
        errors = state.errors
    except Exception as exc:
        weather = []
        errors = [*state.errors, f"weather provider failed: {exc}"]

    return {
        "weather": weather,
        "errors": errors,
        "progress_events": [*state.progress_events, "weather"],
    }


def _parse_date(value: str | date) -> date:
    return date.fromisoformat(value) if isinstance(value, str) else value
