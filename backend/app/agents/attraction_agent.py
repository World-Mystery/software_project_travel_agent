from typing import Any

from app.agents.state import PlanningState
from app.services.providers import get_attraction_provider


def run_attraction_agent(state: PlanningState) -> dict[str, Any]:
    provider = get_attraction_provider()
    try:
        attractions = provider.search(
            state.request["city"],
            state.user_profile.get("interest_tags", []),
        )
        errors = state.errors
    except Exception as exc:
        attractions = []
        errors = [*state.errors, f"attraction provider failed: {exc}"]

    return {
        "attractions": attractions,
        "errors": errors,
        "progress_events": [*state.progress_events, "attraction"],
    }
